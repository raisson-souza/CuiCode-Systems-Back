import User from "../../../classes/User"

import { Client } from "pg";

import IsUndNull from "../../../functions/IsUndNull";

import SqlLabel from "../../../classes/SqlLabel";
import EmailSender from "../../functions/EmailSender";
import EmailTitles from "../../../enums/EmailTitles";
import UserInSql from "../../../interfaces/UserInSql";

/**
 * Updates a user.
 */
export default async function UpdateUser
(
    db_connection : Client,
    db_stage : string,
    user : User,
)
: Promise<void>
{
    try
    {
        if (IsUndNull(user.Id))
            throw new Error("Id do usuário a ser editado deve ser informado.")

        const userInSql = user.ConvertUserToSqlObject()

        const checkUserExistenceQuery = `SELECT * FROM ${ db_stage }.users WHERE id = ${ user.Id }`

        const userDb = await db_connection.query(checkUserExistenceQuery)
            .then(result => {
                if (result.rowCount == 0)
                    throw new Error(`Usuário ${ user.GenerateUserKey() } não encontrado.`)

                // userDb assume o tipo de userInSql que utiliza de assinatura de índice
                // na qual permite acesso as chaves por qualquer string.
                return result.rows[0] as UserInSql
            })
            .catch(ex => {
                throw new Error((ex as Error).message)
            })

        let newUserProps : SqlLabel[] = []

        // Serão comparadas as diferenças entre o usuário do banco com as novas alterações.
        // Um objeto contendo o nome da coluna, o valor e o tipo do valor será criado.
        for (let prop in userDb)
        {
            if (userDb[prop] != userInSql[prop] && prop != "id" && !IsUndNull(userInSql[prop]))
            {
                newUserProps.push(new SqlLabel(prop, userInSql[prop]))

                // Se um dos parâmetros do usuário a ser editado é o email, o novo email deve ser validado.
                if (prop == "email")
                {
                    newUserProps.push(new SqlLabel("email_approved", false))
                    user.EmailAproved = false
                }

                if (prop == "username" && userDb["email_approved"] == false)
                    throw new Error("Para editar o username é necessário aprovar o email.")

                if (prop == "active" || prop == "deleted")
                    DetectUserDeactivationOrDeletion(prop, userInSql[prop], user, userDb)
            }
        }

        if (newUserProps.length == 0)
            throw new Error("Nenhuma edição realizada no usuário.")

        const userPutQuery = `UPDATE ${ db_stage }.users SET ${ BuildUserPutQuery(newUserProps) } WHERE id = ${ user.Id }`

        await db_connection.query(userPutQuery)
            .then(async () => {})
            .catch(ex => {
                throw new Error((ex as Error).message)
            })
    }
    catch (ex)
    {
        throw new Error((ex as Error).message)
    }
}

function BuildUserPutQuery(newPropsList : SqlLabel[]) : string
{
    let setQuery = ""

    newPropsList.forEach((prop, i) => {
        if (!IsUndNull(prop.ColumnValue))
        {
            setQuery += `${ prop.ColumnName } = ${ prop.ParsePropNameToSql() }`
            setQuery += (i < newPropsList.length - 1) ? ", " : ""
        }
    })

    return setQuery
}

/**
 * Envia email de registro ao sistema em caso de desativação ou exclusão de usuário.
 * @param action Ação (desativação / exclusão).
 * @param user Usuário recém editado (novo).
 * @param userDb Usuário no banco (antigo).
 */
function DetectUserDeactivationOrDeletion
(
    actionName : string,
    action : boolean,
    user : User,
    userDb : UserInSql
) : void
{
    let emailMessage = `Usuário ${ IsUndNull(user.Name) ? userDb["name"] : user.Name } (${ user.GenerateUserKey() }) foi `

    if (actionName == "active")
    {
        emailMessage += action
            ? "ativado(a) "
            : "desativado(a) "
    }
    else
    {
        emailMessage += action
            ? "excluído(a) "
            : "restaurado(a) "
    }

    emailMessage += "no sistema."

    new EmailSender().Internal(EmailTitles.USER_DEACTIVATED, emailMessage)
}

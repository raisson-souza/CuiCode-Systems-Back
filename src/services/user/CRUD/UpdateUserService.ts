import SendApprovalEmailOperation from "../services/email/SendApprovalUserEmailOperation"

import ValidateUser from "../utilities/ValidateUser"

import Service from "../../../classes/Service"
import User from "../../../classes/User"
import Operation from "../../../classes/Operation"
import SqlLabel from "../../../classes/SqlLabel"

import IUserInSql from "../../../interfaces/IUserInSql"

import Send from "../../../functions/Responses"
import IsUndNull from "../../../functions/IsUndNull"
import EmailSender from "../../../functions/system/EmailSender"

import EmailTitlesEnum from "../../../enums/EmailTitlesEnum"

/**
 * Updates a user
 */
class UpdateUserService extends Service
{
    Action = "Edição de usuário."

    CheckBody(body : any) : User
    {
        if (IsUndNull(body))
            throw new Error("Corpo da requisição inválido.")

        const user = new User(body, false, false, true);

        if (IsUndNull(user.Id))
            throw new Error("Id de usuário a ser atualizado não encontrado.")

        return user
    }

    async Operation()
    {
        try
        {
            const {
                REQ,
                RES,
                DB_connection,
                Action
            } = this

            const user = this.CheckBody(REQ.body)

            await ValidateUser(DB_connection, user, false)

            await Promise.resolve(new UpdateUserOperation(user, DB_connection).PerformOperation())
                .then(() => {
                    Send.Ok(RES, `Usuário editado com sucesso.`, Action)
                })
                .catch(ex => {
                    throw new Error((ex as Error).message)
                })

            if (!IsUndNull(user.EmailAproved) && !user.EmailAproved)
                await new SendApprovalEmailOperation(user, DB_connection).PerformOperation()
        }
        catch (ex)
        {
            Send.Error(this.RES, `Houve um erro ao editar o usuário. Erro: ${ (ex as Error).message }`, this.Action)
        }
        finally
        {
            this.DB_connection.end()
        }
    }
}

class UpdateUserOperation extends Operation
{
    async PerformOperation()
    {
        try
        {
            const {
                User,
                DB_connection
            } = this

            if (IsUndNull(User!.Id))
                throw new Error("Id do usuário a ser editado deve ser informado.")

            const userInSql = User!.ConvertUserToSqlObject()

            const checkUserExistenceQuery = `SELECT * FROM users WHERE id = ${ User!.Id }`

            const userDb = await DB_connection.query(checkUserExistenceQuery)
                .then(result => {
                    if (result.rowCount == 0)
                        throw new Error(`Usuário ${ User!.GenerateUserKey() } não encontrado.`)

                    // userDb assume o tipo de userInSql que utiliza de assinatura de índice
                    // na qual permite acesso as chaves por qualquer string.
                    return result.rows[0] as IUserInSql
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
                        User!.EmailAproved = false
                    }

                    if (prop == "username" && userDb["email_approved"] == false)
                        throw new Error("Para editar o username é necessário aprovar o email.")

                    if (prop == "active" || prop == "deleted")
                        this.DetectUserDeactivationOrDeletion(prop, userInSql[prop], User!, userDb)
                }
            }

            if (newUserProps.length == 0)
                throw new Error("Nenhuma edição realizada no usuário.")

            const userPutQuery = `UPDATE users SET ${ this.BuildUserPutQuery(newUserProps) } WHERE id = ${ User!.Id }`

            await DB_connection.query(userPutQuery)
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

    private BuildUserPutQuery(newPropsList : SqlLabel[]) : string
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
    private DetectUserDeactivationOrDeletion
    (
        actionName : string,
        action : boolean,
        user : User,
        userDb : IUserInSql
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

        new EmailSender().Internal(EmailTitlesEnum.USER_DEACTIVATED, emailMessage)
    }
}

export default UpdateUserService
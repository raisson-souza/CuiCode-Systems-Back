import { Client } from "pg"

import SendApprovalEmailOperation from "../services/email/SendApprovalUserEmailOperation"
import SetUserLogOperation from "../services/log/SetUserLogOperation"

import ValidateUser from "../utilities/ValidateUser"

import { EntityLog } from "../../../classes/DTOs/EntityLog"
import ClientService from "../../../classes/service/ClientService"
import Operation from "../../../classes/Operation"
import User from "../../../classes/User"

import IUserInSql from "../../../interfaces/IUserInSql"

import EmailSender from "../../../functions/system/EmailSender"
import IsUndNull from "../../../functions/IsUndNull"
import Send from "../../../functions/system/Send"

import EmailTitlesEnum from "../../../enums/EmailTitlesEnum"
import PermissionLevelEnum from "../../../enums/PermissionLevelEnum"

/**
 * Updates a user
 */
class UpdateUserService extends ClientService
{
    Action = "Edição de usuário."

    CheckBody() : User
    {
        const body = this.REQ.body as any

        if (IsUndNull(body))
            throw new Error("Corpo da requisição inválido.")

        const user = new User(body, false, true)

        if (IsUndNull(user.Id))
            throw new Error("Id de usuário a ser atualizado não encontrado.")

        return user
    }

    CheckQuery() { throw new Error("Method not implemented.") }

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

            const user = this.CheckBody()

            await this.AuthenticateRequestor()

            this.ValidateRequestor(PermissionLevelEnum.Member, user.Id)

            this.ValidateUpdate(user)

            await ValidateUser(DB_connection, user, false)

            await Promise.resolve(new UpdateUserOperation(user, DB_connection, this.SameUserAuthAndUserToOperate, this.USER_auth!.Id!).PerformOperation())
                .then(() => {
                    Send.Ok(RES, `Usuário editado com sucesso.`, Action)
                })
                .catch(ex => {
                    throw new Error((ex as Error).message)
                })
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

    private ValidateUpdate(newUser : User)
    {
        if
        (
            !IsUndNull(newUser.EmailAproved) ||
            !IsUndNull(newUser.Created) ||
            !IsUndNull(newUser.Active) ||
            !IsUndNull(newUser.Deleted) ||
            !IsUndNull(newUser.Modified) ||
            !IsUndNull(newUser.ModifiedBy)
        )
            throw new Error("Uma ou mais propriedades não podem ser editadas.")

        if (!IsUndNull(newUser.PermissionLevel))
        {
            const newLevel = newUser.PermissionLevel!.Value

            if (newLevel === 4)
                throw new Error("Um usuário não pode se tornar ROOT.")

            if (newLevel === 1)
                throw new Error("Um usuário não pode se tornar convidado.")

            if (newLevel === 2 || newLevel === 3)
                this.USER_auth!.CheckUserPermission(PermissionLevelEnum.Root)
        }
    }
}

class UpdateUserOperation extends Operation
{
    SameUserAuthAndUserToOperate : boolean
    ModifiedById : number

    constructor
    (
        user : User | null,
        db_connection : Client,
        sameUserAuthAndUserToOperate : boolean,
        modifiedById : number
    )
    {
        super(user, db_connection)
        this.SameUserAuthAndUserToOperate = sameUserAuthAndUserToOperate
        this.ModifiedById = modifiedById
    }

    async PerformOperation()
    {
        try
        {
            const { DB_connection } = this

            if (IsUndNull(this.User!.Id))
                throw new Error("Id do usuário a ser editado deve ser informado.")

            const userInSql = this.User!.ConvertUserToSqlObject()

            const checkUserExistenceQuery = `SELECT * FROM users WHERE id = ${ this.User!.Id }`

            const userDb = await DB_connection.query(checkUserExistenceQuery)
                .then(result => {
                    if (result.rowCount == 0)
                        throw new Error(`Usuário ${ this.User!.GenerateUserKey() } não encontrado.`)

                    // userDb assume o tipo de userInSql que utiliza de assinatura de índice
                    // na qual permite acesso as chaves por qualquer string.
                    return result.rows[0] as IUserInSql
                })
                .catch(ex => {
                    throw new Error((ex as Error).message)
                })

            let userLog : EntityLog[] = []

            let emailChanged = false

            // Serão comparadas as diferenças entre o usuário do banco com as novas alterações.
            for (let prop in userDb)
            {
                //  Valida se a prop do usuário do banco é diferente da prop do model do usuário, eliminando props não atualizadas (indefinidas)
                if (userDb[prop] != userInSql[prop] && !IsUndNull(userInSql[prop]))
                {
                    userLog.push(new EntityLog(prop, userDb[prop], userInSql[prop]))

                    // Se um dos parâmetros do usuário a ser editado é o email, o novo email deve ser validado.
                    if (prop == "email")
                    {
                        userLog.push(new EntityLog("email_approved", userDb["email_approved"], false))
                        emailChanged = true
                    }

                    if (prop == "username" && userDb["email_approved"] == false)
                        throw new Error("Para editar o username é necessário aprovar o email.")

                    if (prop == "active" || prop == "deleted")
                        this.DetectUserDeactivationOrDeletion(prop, userInSql[prop], this.User!, userDb)
                }
            }

            if (userLog.length == 0)
                throw new Error("Nenhuma edição realizada no usuário.")

            const query = `UPDATE users SET ${ this.BuildUserPutQuery(userLog) } WHERE id = ${ this.User!.Id }`

            await DB_connection.query(query)
                .then(() => {})
                .catch(ex => {
                    throw new Error((ex as Error).message)
                })

            // Valida se o email foi mudado, se sim, captura as informações necessárias para a nova aprovação de email.
            if (emailChanged)
                this.HandleEmailChange(userDb, userLog)

            await new SetUserLogOperation(this.User, DB_connection, userLog, !this.SameUserAuthAndUserToOperate).PerformOperation()
        }
        catch (ex)
        {
            throw new Error((ex as Error).message)
        }
    }

    /**
     * Constrói e retorna a query de atualização do usuário baseado nos novos valores.
     */
    private BuildUserPutQuery(userLog : EntityLog[]) : string
    {
        let query = ""

        userLog.forEach(prop => {
            query += `"${ prop.NewValue.SQLValue.ColumnName }" = ${ prop.NewValue.SQLValue.ParsePropNameToSql() },`
        })

        query += `modified = now(), modified_by = ${ this.ModifiedById }`

        return query
    }

    /**
     * Envia email de registro ao sistema em caso de desativação ou exclusão de usuário.
     * @param action Excluido verdadeiro > Excluido | Excluido falso > Restaurado | Ativado verdadeiro > Ativado | Ativado falso > Desativado
     */
    private DetectUserDeactivationOrDeletion
    (
        actionName : string,
        action : boolean,
        userModel : User,
        userDb : IUserInSql
    ) : void
    {
        const userDbConverted = new User(userDb, true)
        let emailMessage = `Usuário (${ userModel.GenerateUserKey() } / ${ userDbConverted.GenerateUserKey() }) foi `

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

    /**
     * Envia um email de aprovação de email para o novo email do usuário atualizado.
     */
    private async HandleEmailChange
    (
        userDb : IUserInSql,
        userLog : EntityLog[]
    )
    {
        const userModelToEmailChange = new User(
            {
                "Id": userDb["id"],
                "Email": EntityLog.GetProperyValue("email", userLog).NewValue,
                "Name": EntityLog.GetProperyValue("name", userLog).NewValue,
                "Username": EntityLog.GetProperyValue("username", userLog).NewValue
            }
        )
        await new SendApprovalEmailOperation(userModelToEmailChange, this.DB_connection).PerformOperation()
    }
}

export default UpdateUserService
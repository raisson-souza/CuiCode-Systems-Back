import ClientService from "../../../classes/service/ClientService"
import SendApprovalEmailOperation from "../services/email/SendApprovalUserEmailOperation"
import SetUserLogOperation from "../services/log/SetUserLogOperation"

import { EntityLog } from "../../../classes/DTOs/base/EntityLog"
import User from "../../../classes/entities/user/User"
import UserRepository from "../../../classes/entities/user/UserRepository"

import IUserInSql from "../../../interfaces/IUserInSql"

import EmailSender from "../../../classes/entities/email/EmailSender"
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

        const user = new User(body)

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
                RES,
                DB_connection,
                Action
            } = this

            const user = this.CheckBody()

            await this.AuthenticateRequestor()

            this.ValidateRequestor(PermissionLevelEnum.Member, user.Id)

            await UserRepository.ValidateUpdate(user, DB_connection)

            this.ValidateUpdate(user)

            await this.PersistUserUpdate(user)

            Send.Ok(RES, `Usuário editado com sucesso.`, Action)
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
        if (!IsUndNull(newUser.PermissionLevel))
        {
            const newLevel = newUser.PermissionLevel!.Value

            if (newLevel === 4)
                throw new Error("Um usuário não pode se tornar ROOT.")

            if (newLevel === 1)
                throw new Error("Um usuário não pode se tornar convidado.")

            if (newLevel === 2 || newLevel === 3)
                UserRepository.ValidateUserPermission(this.USER_auth!, PermissionLevelEnum.Root)
        }
    }

    async PersistUserUpdate(user : User)
    {
        try
        {
            const { DB_connection } = this

            if (IsUndNull(user!.Id))
                throw new Error("Id do usuário a ser editado deve ser informado.")

            const userLogProps = await this.GatherUserLog(user)

            const {
                userDb,
                userLog,
                emailChanged
            } = userLogProps

            const query = `UPDATE users SET ${ this.BuildUserPutQuery(userLog) } WHERE id = ${ user!.Id }`

            await DB_connection.query(query)
                .then(() => {})
                .catch(ex => {
                    throw new Error((ex as Error).message)
                })

            // Valida se o email foi mudado, se sim, captura as informações necessárias para a nova aprovação de email.
            if (emailChanged)
                this.HandleEmailChange(userDb, userLog)

            await new SetUserLogOperation(user, DB_connection, userLog, !this.SameUserAuthAndUserToOperate).PerformOperation()
        }
        catch (ex)
        {
            throw new Error((ex as Error).message)
        }
    }

    private async GatherUserLog(user : User)
    : Promise<{
        userDb : IUserInSql,
        userLog : EntityLog[],
        emailChanged : boolean
    }>
    {
        const userModelInSQL = user!.ConvertUserToSqlObject()

        const userDbQuery = `SELECT * FROM users WHERE id = ${ user!.Id }`

        const userDb = await this.DB_connection.query(userDbQuery)
            .then(result => {
                if (result.rowCount == 0)
                    throw new Error(`Usuário ${ user!.GenerateUserKey() } não encontrado.`)

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
            if (userDb[prop] != userModelInSQL[prop] && !IsUndNull(userModelInSQL[prop]))
            {
                userLog.push(new EntityLog(prop, userDb[prop], userModelInSQL[prop]))

                // Se um dos parâmetros do usuário a ser editado é o email, o novo email deve ser validado.
                if (prop == "email")
                {
                    userLog.push(new EntityLog("email_approved", userDb["email_approved"], false))
                    emailChanged = true
                }

                if (prop == "username" && userDb["email_approved"] == false)
                    throw new Error("Para editar o username é necessário aprovar o email.")

                if (prop == "active" || prop == "deleted")
                    this.DetectUserDeactivationOrDeletion(prop, userModelInSQL[prop], user!, userDb)
            }
        }

        if (userLog.length == 0)
            throw new Error("Nenhuma edição realizada no usuário.")

        return {
            userDb: userDb,
            userLog: userLog,
            emailChanged: emailChanged
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

        query += `modified = now(), modified_by = ${ this.USER_auth!.Id }`

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
        const userDbConverted = new User(userDb)
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

        EmailSender.Internal(EmailTitlesEnum.USER_DEACTIVATED, emailMessage)
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
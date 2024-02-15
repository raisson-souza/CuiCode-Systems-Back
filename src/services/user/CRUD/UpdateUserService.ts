import SendApprovalEmailOperation from "../services/email/SendApprovalUserEmailOperation"

import { EntityLog } from "../../../classes/entities/base/EntityLog"
import ClientService from "../../../classes/service/ClientService"
import EmailSender from "../../../classes/entities/email/EmailSender"
import Exception from "../../../classes/custom/Exception"
import ResponseMessage from "../../../classes/system/ResponseMessage"
import User from "../../../classes/entities/user/User"
import UserBase from "../../../classes/bases/UserBase"
import UserLogBase from "../../../classes/bases/UserLogBase"
import UserRepository from "../../../repositories/UserRepository"

import AnySearch from "../../../interfaces/AnySearch"

import IsUndNull from "../../../functions/logic/IsUndNull"

import EmailTitlesEnum from "../../../enums/EmailTitlesEnum"
import HttpStatusEnum from "../../../enums/system/HttpStatusEnum"
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
            ResponseMessage.SendNullField(["Id"], this.Action, this.RES)

        return user
    }

    CheckQuery() { throw new Error("Method not implemented.") }

    CheckParams() { }

    async Operation()
    {
        try
        {
            const {
                DB_connection,
                Action
            } = this

            const userModel = this.CheckBody()

            await this.AuthenticateRequestor()

            this.ValidateRequestor(PermissionLevelEnum.Member, userModel.Id)

            await UserRepository.ValidateUpdate(userModel, DB_connection)

            this.ValidateUpdate(userModel)

            await this.PersistUserUpdate(userModel)

            ResponseMessage.Send(
                HttpStatusEnum.OK,
                "Usuário editado com sucesso.",
                Action,
                this.RES
            )
        }
        catch (ex)
        {
            ResponseMessage.Send(
                HttpStatusEnum.INTERNAL_SERVER_ERROR,
                `Houve um erro ao editar o usuário. Erro: ${ (ex as Error).message }`,
                this.Action,
                this.RES
            )
            Exception.UnexpectedError((ex as Error).message, this.Action)
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

        if (!IsUndNull(newUser.Password) || !IsUndNull(newUser.PasswordHint))
            this.NotImplementedUpdate("A senha ou dica de senha não podem ser editadas nesta rota.")

        if (!IsUndNull(newUser.PhotoBase64))
            this.NotImplementedUpdate("A foto do usuário não pode ser editada nesta rota.")
    }

    async PersistUserUpdate(userModel : User)
    {
        try
        {
            const { DB_connection } = this

            if (IsUndNull(userModel!.Id))
                throw new Error("Id do usuário a ser editado deve ser informado.")

            const userLogProps = await this.GatherUserLog(userModel)

            const {
                userLog,
                emailChanged
            } = userLogProps

            const updatedUser = await UserBase.Update(DB_connection, userModel.Id, userLog, this.USER_auth!.Id)

            if (emailChanged)
                await new SendApprovalEmailOperation(updatedUser, this.DB_connection).PerformOperation()

            this.DetectUserDeactivationOrDeletion(userLog, updatedUser!)

            const isAdm = this.USER_auth!.PermissionLevel!.Value >= 3

            await UserLogBase.Create(
                this.DB_connection,
                userModel.Id,
                this.USER_auth!.Id,
                isAdm,
                userLog
            )
        }
        catch (ex)
        {
            throw new Error((ex as Error).message)
        }
    }

    private async GatherUserLog(userModel : User)
    : Promise<{
        userLog : EntityLog[],
        emailChanged : boolean
    }>
    {
        const userDb = await UserBase.Get(this.DB_connection, userModel.Id)

        if (IsUndNull(userDb))
            throw new Error(`Usuário ${ userModel!.GenerateUserKey() } não encontrado.`)

        let userLog : EntityLog[] = []

        let emailChanged = false

        const userModelSql = userModel.ConvertToSqlObject() as AnySearch
        const userDbSql = userDb!.ConvertToSqlObject() as AnySearch

        // Serão comparadas as diferenças entre o usuário do banco com o usuário modelo.
        for (let prop in userDbSql)
        {
            //  Valida se a prop do usuário do banco é diferente da prop do model do usuário, eliminando props não atualizadas (indefinidas)
            if (userDbSql[prop] != userModelSql[prop] && !IsUndNull(userModelSql[prop]))
            {
                userLog.push(new EntityLog(prop, userDbSql[prop], userModelSql[prop]))

                // Se um dos parâmetros do usuário a ser editado é o email, o novo email deve ser validado.
                if (prop == "email")
                {
                    userLog.push(new EntityLog("email_approved", userDbSql["email_approved"], false))
                    emailChanged = true
                }

                if (prop == "username" && userDbSql["email_approved"] == false)
                    throw new Error("Para editar o username é necessário aprovar o email.")
            }
        }

        if (userLog.length == 0)
            throw new Error("Nenhuma edição realizada no usuário.")

        return {
            userLog: userLog,
            emailChanged: emailChanged
        }
    }

    /**
     * Envia email de registro ao sistema em caso de desativação ou exclusão de usuário.
     */
    private DetectUserDeactivationOrDeletion
    (
        userLog : EntityLog[],
        updatedUser : User
    )
    {
        let emailMessage = `Usuário ${ updatedUser.GenerateUserKey() } foi `

        const deleted = EntityLog.GetProperyValue('deleted', userLog)

        if (!IsUndNull(deleted.NewValue))
        {
            emailMessage += deleted.NewValue
                ? "deletado(a)"
                : "restaurado(a)"
        }

        const active = EntityLog.GetProperyValue('active', userLog)

        if (!IsUndNull(active.NewValue))
        {
            emailMessage += active.NewValue
                ? "ativado(a)"
                : "desativado(a)"
        }

        emailMessage += "no sistema."

        EmailSender.Internal(EmailTitlesEnum.USER_DEACTIVATED, emailMessage)
    }

    private NotImplementedUpdate(message: string)
    {
        ResponseMessage.Send(
            HttpStatusEnum.NOT_IMPLEMENTED,
            message,
            this.Action,
            this.RES
        )
    }
}

export default UpdateUserService
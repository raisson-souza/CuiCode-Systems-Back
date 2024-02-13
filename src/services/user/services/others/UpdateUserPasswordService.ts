import SetUserLogOperation from "../log/SetUserLogOperation"

import { EntityLog } from "../../../../classes/entities/base/EntityLog"
import ClientService from "../../../../classes/service/ClientService"
import Exception from "../../../../classes/custom/Exception"
import ResponseMessage from "../../../../classes/system/ResponseMessage"
import User from "../../../../classes/entities/user/User"
import UserBase from "../../../../classes/bases/UserBase"
import UserRepository from "../../../../repositories/UserRepository"

import EncryptInfo from "../../../../functions/security/EncryptPassword"
import IsUndNull from "../../../../functions/logic/IsUndNull"
import SqlInjectionVerifier from "../../../../functions/SQL/SqlInjectionVerifier"

import HttpStatusEnum from "../../../../enums/system/HttpStatusEnum"
import PermissionLevelEnum from "../../../../enums/PermissionLevelEnum"

/**
 * Atualiza a senha e dica de senha de um usuário.
 */
class UpdateUserPasswordService extends ClientService
{
    Action = "Atualização de senha de usuário."

    CheckBody()
    {
        const { REQ , Action, RES } = this

        if (IsUndNull(REQ.body.password))
            ResponseMessage.SendNullField(["password"], Action, RES)

        if (IsUndNull(REQ.body.password_hint))
            ResponseMessage.SendNullField(["password_hint"], Action, RES)

        return {
            "password": REQ.body.password,
            "password_hint": REQ.body.password_hint
        }
    }

    CheckParams()
    {
        if (IsUndNull(this.REQ.params["user_id"]))
            ResponseMessage.SendNullField(["user_id"], this.Action, this.RES)

        return parseInt(this.REQ.params["user_id"])
    }

    CheckQuery() { }

    async Operation()
    {
        try
        {
            const {
                DB_connection,
                Action
            } = this

            await this.AuthenticateRequestor()

            const userId = this.CheckParams()

            const {
                password,
                password_hint
            } = this.CheckBody()

            const userModel = new User({ "Id": userId, "Password": password, "PasswordHint": password_hint })

            this.ValidateRequestor(PermissionLevelEnum.Member, userModel.Id)

            const userDb = await UserBase.Get(DB_connection, userId)

            if (IsUndNull(userDb))
                ResponseMessage.NotFoundUser(this.RES, Action)

            this.ValidateUpdate(userModel, userDb!)

            await this.PersistUpdate(userModel)

            ResponseMessage.Send(
                HttpStatusEnum.OK,
                "Senha e dica de senha atualizadas com sucesso.",
                Action,
                this.RES
            )

            await this.SetUserLog(userModel, userDb!)
        }
        catch (ex)
        {
            ResponseMessage.Send(
                HttpStatusEnum.INTERNAL_SERVER_ERROR,
                `Houve um erro ao editar a senha do usuário. Erro: ${ (ex as Error).message }`,
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

    private ValidateUpdate
    (
        userModel : User,
        userDb : User
    ) : void
    {
        const encryptedPassword = EncryptInfo(userModel.Password)

        if (encryptedPassword === userDb.Password)
        {
            ResponseMessage.Send(
                HttpStatusEnum.INVALID,
                "A nova senha é identica a antiga.",
                this.Action,
                this.RES
            )
            throw new Error("A nova senha é identica a antiga.")
        }

        UserRepository.ValidatePassword(userModel.Password)

        UserRepository.ValidatePasswordHint(
            userModel.Password,
            userModel.PasswordHint
        )
    }

    async PersistUpdate(userModel: User)
    {
        SqlInjectionVerifier(userModel.Password)
        SqlInjectionVerifier(userModel.PasswordHint)

        userModel.EncryptPassword()

        let query = `UPDATE users SET "password" = '${ userModel.Password }', "password_hint" = '${ userModel.PasswordHint }',`
        query += ` "modified" = now(), "modified_by" = ${ this.USER_auth!.Id } `
        query += `WHERE id = ${ userModel.Id }`

        await this.DB_connection.query(query)
    }

    async SetUserLog
    (
        userModel: User,
        userDb : User
    )
    {
        const userLog : EntityLog[] = []

        userLog.push(
            new EntityLog(
                "password",
                userDb.Password,
                userModel.Password
            )
        )

        userLog.push(
            new EntityLog(
                "password_hint",
                userDb.PasswordHint,
                userModel.PasswordHint
            )
        )

        const isAdm = this.USER_auth!.PermissionLevel!.Value >= 3

        await new SetUserLogOperation(userModel, this.DB_connection, userLog, isAdm).PerformOperation()
    }
}

export default UpdateUserPasswordService
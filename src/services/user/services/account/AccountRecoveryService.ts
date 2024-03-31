import { EntityLog } from "../../../../classes/entities/base/EntityLog"
import EmailSender from "../../../../classes/entities/email/EmailSender"
import Exception from "../../../../classes/custom/Exception"
import ResponseMessage from "../../../../classes/system/ResponseMessage"
import ServerService from "../../../../classes/service/ServerService"
import User from "../../../../classes/entities/user/User"
import UserAccountRestorationBase from "../../../../classes/bases/UserAccountRestorationBase"
import UserBase from "../../../../classes/bases/UserBase"
import UserLogBase from "../../../../classes/bases/UserLogBase"

import IsJwtExpired from "../../../../functions/math/IsTimeExpired"
import IsUndNull from "../../../../functions/logic/IsUndNull"

import EmailTitlesEnum from "../../../../enums/EmailTitlesEnum"
import HttpStatusEnum from "../../../../enums/system/HttpStatusEnum"

/**
 * Realiza a operação de recuperação de conta de um usuário.
 */
class AccountRecoveryService extends ServerService
{
    Action = "Recuperação de conta."

    CheckBody()
    {
        const password = this.REQ.body["password"]
        const passwordHint = this.REQ.body["passwordHint"]

        if (IsUndNull(password)) {
            ResponseMessage.SendNullField({
                expressResponse: this.RES,
                fields: ["password"],
                log: this.Action
            })
        }

        if (IsUndNull(passwordHint)) {
            ResponseMessage.SendNullField({
                expressResponse: this.RES,
                fields: ["passwordHint"],
                log: this.Action
            })
        }

        return {
            "password": password as string,
            "passwordHint": passwordHint as string
        }
    }

    CheckQuery() : string
    {
        const jwt = this.REQ.query["jwt"]

        if (IsUndNull(jwt)) {
            ResponseMessage.SendNullField({
                expressResponse: this.RES,
                fields: ["jwt"],
                log: this.Action
            })
        }

        return String(jwt)
    }

    CheckParams() { }

    async Operation()
    {
        try
        {
            const {
                DB_connection,
                Action
            } = this

            this.AuthenticateRequestor()

            const jwt = this.CheckQuery()

            const {
                password,
                passwordHint
            } = this.CheckBody()

            const userAccountRestoration = await UserAccountRestorationBase.GetByJwt(
                DB_connection,
                jwt
            )

            if (IsUndNull(userAccountRestoration))
            {
                const msg = "Registro de recuperação de conta não encontrado."
                ResponseMessage.Send({
                    status: HttpStatusEnum.NOT_FOUND,
                    data: msg,
                    log: this.Action,
                    expressResponse: this.RES
                })
                Exception.Error(msg, Action)
            }

            if (IsJwtExpired(userAccountRestoration!.Jwt!))
            {
                const msg = "Registro de recuperação de conta expirado, tente novamente!"
                ResponseMessage.Send({
                    status: HttpStatusEnum.NOT_FOUND,
                    data: msg,
                    log: this.Action,
                    expressResponse: this.RES
                })
                await UserAccountRestorationBase.Expire(
                    DB_connection,
                    userAccountRestoration!.Id
                )
                Exception.Error(msg, Action)
            }

            await userAccountRestoration!.GetForeignKey(DB_connection)

            const userId = userAccountRestoration!.UserId

            const newUser = new User({
                "Id": userId,
                "Password": password,
                "PasswordHint": passwordHint
            })

            newUser.EncryptPassword()

            await UserBase.UpdateByModel(
                DB_connection,
                newUser,
                newUser.Id
            )

            ResponseMessage.Send({
                status: HttpStatusEnum.OK,
                data: "Credenciais da conta atualizados com sucesso!",
                log: this.Action,
                expressResponse: this.RES
            })

            await UserAccountRestorationBase.Complete(
                DB_connection,
                userAccountRestoration!.Id
            )

            EmailSender.Internal(
                EmailTitlesEnum.USER_ACCOUNT_RESTORATION,
                `Conta de ${ userAccountRestoration!.User!.GenerateUserKey() } restaurada.`
            )

            const userLog = this.GenerateLog(
                userAccountRestoration!.User!,
                newUser
            )

            await UserLogBase.Create(
                DB_connection,
                userId,
                userId,
                userAccountRestoration!.User!.IsAdm(),
                userLog
            )
        }
        catch (ex)
        {
            ResponseMessage.Send({
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR,
                data: `Houve um erro ao atualizar as credenciais da conta. Erro: ${ (ex as Error).message }`,
                log: this.Action,
                expressResponse: this.RES
            })
            Exception.UnexpectedError((ex as Error).message, this.Action)
        }
        finally
        {
            this.DB_connection.end()
        }
    }

    private GenerateLog
    (
        userDb : User,
        userModel : User
    ) : EntityLog[]
    {
        const logList : EntityLog[] = []

        logList.push(new EntityLog(
            "password",
            userDb.Password,
            userModel.Password
        ))

        logList.push(new EntityLog(
            "passwordHint",
            userDb.PasswordHint,
            userModel.PasswordHint
        ))

        return logList
    }
}

export default AccountRecoveryService
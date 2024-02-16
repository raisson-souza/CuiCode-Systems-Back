import ClientService from "../../../../classes/service/ClientService"
import EmailSender from "../../../../classes/entities/email/EmailSender"
import Exception from "../../../../classes/custom/Exception"
import ResponseMessage from "../../../../classes/system/ResponseMessage"
import User from "../../../../classes/entities/user/User"
import UserAccountRestoration from "../../../../classes/entities/user/UserAccountRestoration"
import UserAccountRestorationBase from "../../../../classes/bases/UserAccountRestorationBase"
import UserAccountRestorationRepository from "../../../../repositories/UserAccountRestorationRepository"
import UserBase from "../../../../classes/bases/UserBase"
import UserRepository from "../../../../repositories/UserRepository"

import EmailTitlesEnum from "../../../../enums/EmailTitlesEnum"
import HttpStatusEnum from "../../../../enums/system/HttpStatusEnum"

import IsUndNull from "../../../../functions/logic/IsUndNull"
import SqlInjectionVerifier from "../../../../functions/SQL/SqlInjectionVerifier"

/**
 * Realiza a confirmação de restauração de conta.
 */
class ConfirmAccountRecoveyService extends ClientService
{
    Action = "Confirmação de restauração de conta."

    CheckBody() { }

    CheckQuery() : string
    {
        const email = this.REQ.query["email"]

        if (IsUndNull(email))
            ResponseMessage.SendNullField(["email"], this.Action, this.RES)

        return String(email)
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

            const email = this.CheckQuery()

            const user = await this.QueryUserByEmail(email)

            if (IsUndNull(user))
                ResponseMessage.NotFoundUser(this.RES, Action)

            const accountHasPreviusRestorationProcess = await UserAccountRestorationRepository.ValidateCreation(
                DB_connection,
                user!.Id
            )

            if (!accountHasPreviusRestorationProcess)
            {
                const msg = "Já existe uma solicitação de restauração de conta ativa para este usuário.\nAguarde expirar ou conclua o processo."
                ResponseMessage.Send(
                    HttpStatusEnum.INVALID,
                    msg,
                    Action,
                    this.RES
                )
                Exception.Error(msg, Action)
            }

            const userAccountRestoration = new UserAccountRestoration(
                {
                    "UserId": user!.Id,
                    "UserEmail": user!.Email
                }
            )

            userAccountRestoration.CreateJwt()

            await UserAccountRestorationBase.Create(
                DB_connection,
                userAccountRestoration
            )

            this.SendRestorationEmail(user!)

            ResponseMessage.Send(
                HttpStatusEnum.CREATED,
                `Solicitação de restauração de conta criada com sucesso.`,
                Action,
                this.RES
            )
        }
        catch (ex)
        {
            ResponseMessage.Send(
                HttpStatusEnum.INTERNAL_SERVER_ERROR,
                `Houve um erro solicitar restauração de conta. Erro: ${ (ex as Error).message }`,
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

    private async QueryUserByEmail(email : string)
    {
        SqlInjectionVerifier(email)

        UserRepository.ValidateEmail(email)

        return UserBase.GetByEmail(this.DB_connection, email)
    }

    private SendRestorationEmail(user : User)
    {
        const text = `
            Uma restauração de conta foi solicitada para seu usuário ${ user.GenerateUserKey() }.
            Por favor, acesse esta URL para recuperar sua conta: [ URL FRONT-END ]

            Caso esta operação não tenha sido solicitada por você, por favor, desconsidere.
        `

        EmailSender.External(
            EmailTitlesEnum.USER_ACCOUNT_RESTORATION,
            text,
            user.Email
        )
    }
}

export default ConfirmAccountRecoveyService
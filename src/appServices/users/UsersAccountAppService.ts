import AppServiceBase from "../base/AppServiceBase"
import ResponseMessage from "../../classes/system/ResponseMessage"
import UsersAccountService from "../../services/users/UsersAccountService"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"

import IsNil from "../../functions/logic/IsNil"

import IUsersAccountAppService from "./IUsersAccountAppService"

export default class UsersAccountAppService extends AppServiceBase implements IUsersAccountAppService
{
    AppServiceAction = "Conta de Usuários"

    async ApproveEmail()
    {
        const ACTION = `${ this.AppServiceAction } / Aprovação de email`
        try
        {
            const userId = this.REQ.query["user_id"] as string
            const userEmail = this.REQ.query["email"] as string

            if (IsNil(userId) || IsNil(userEmail))
            {
                ResponseMessage.SendNullField({
                    expressResponse: this.RES,
                    fields: ["user_id", "email"],
                    log: ACTION
                })
            }

            await this.Db.ConnectPostgres()

            await UsersAccountService.ApproveEmail({
                Db: this.Db,
                userEmail: userEmail,
                userId: Number.parseInt(userId),
            })

            ResponseMessage.Send({
                expressResponse: this.RES,
                data: "Email aprovado com sucesso.",
                log: ACTION,
                status: HttpStatusEnum.OK
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            ResponseMessage.Send({
                expressResponse: this.RES,
                data: (ex as Error).message,
                log: ACTION,
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR
            })
        }
    }

    async SendEmailApproval()
    {
        const ACTION = `${ this.AppServiceAction } / Envio de Aprovação de Email`
        try
        {
            await this.Db.ConnectPostgres()

            await this.AuthenticateUserRequestor()

            this.ValidateUserRequestor({
                userIdToOperate: this.UserAuth!.Id
            })

            await UsersAccountService.SendEmailApproval({
                Db: this.Db,
                isCreation: false,
                user: this.UserAuth!
            })

            ResponseMessage.Send({
                expressResponse: this.RES,
                data: "Solicitação de aprovação de email enviada com sucesso.",
                log: ACTION,
                status: HttpStatusEnum.OK
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            ResponseMessage.Send({
                expressResponse: this.RES,
                data: (ex as Error).message,
                log: ACTION,
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR
            })
        }
    }

    async AccountRecovery()
    {
        const ACTION = `${ this.AppServiceAction } /`
        try
        {
            await this.Db.ConnectPostgres()

            // await this.AuthenticateUserRequestor()
            // this.AuthenticateSystemRequestor()

            // this.ValidateUserRequestor({
            //     userIdToOperate: 1,
            // })

            ResponseMessage.Send({
                expressResponse: this.RES,
                data: null,
                log: ACTION,
                status: HttpStatusEnum.OK
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            ResponseMessage.Send({
                expressResponse: this.RES,
                data: (ex as Error).message,
                log: ACTION,
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR
            })
        }
    }

    async ConfirmAccountRecovery()
    {
        const ACTION = `${ this.AppServiceAction } /`
        try
        {
            await this.Db.ConnectPostgres()

            // await this.AuthenticateUserRequestor()
            // this.AuthenticateSystemRequestor()

            // this.ValidateUserRequestor({
            //     userIdToOperate: 1,
            // })

            ResponseMessage.Send({
                expressResponse: this.RES,
                data: null,
                log: ACTION,
                status: HttpStatusEnum.OK
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            ResponseMessage.Send({
                expressResponse: this.RES,
                data: (ex as Error).message,
                log: ACTION,
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR
            })
        }
    }

    async UpdatePassword()
    {
        const ACTION = `${ this.AppServiceAction } / Atualização de Senha de Usuário`
        try
        {
            await this.Db.ConnectPostgres()

            await this.AuthenticateUserRequestor()

            const userId = Number.parseInt(this.REQ.body["user_id"])

            this.ValidateUserRequestor({
                userIdToOperate: userId,
            })

            const password = this.REQ.body["password"]
            const passwordHint = this.REQ.body["password_hint"]

            if (IsNil(password) || IsNil(passwordHint))
            {
                ResponseMessage.SendNullField({
                    expressResponse: this.RES,
                    fields: ["password", "password_hint"],
                    log: ACTION
                })
            }

            await UsersAccountService.UpdatePassword({
                Db: this.Db,
                isAdmChange: this.UserAuth!.Id != userId,
                modifiedBy: this.UserAuth!.Id,
                password: password,
                passwordHint: passwordHint,
                userId: userId
            })

            ResponseMessage.Send({
                expressResponse: this.RES,
                data: "Senha e dica de senha atualizadas com sucesso.",
                log: ACTION,
                status: HttpStatusEnum.OK
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            ResponseMessage.Send({
                expressResponse: this.RES,
                data: (ex as Error).message,
                log: ACTION,
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR
            })
        }
    }
}
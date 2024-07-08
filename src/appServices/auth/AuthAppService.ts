import AppServiceBase from "../base/AppServiceBase"
import AuthService from "../../services/auth/AuthService"
import ResponseMessage from "../../classes/system/ResponseMessage"
import UserAuthService from "../../services/auth/UserAuthService"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"

import IsNil from "../../functions/logic/IsNil"

import IAuthAppService from "./IAuthAppService"

export default class AuthAppService extends AppServiceBase implements IAuthAppService
{
    AppServiceAction = "Auth"

    async Login()
    {
        const ACTION = `${ this.AppServiceAction } / Login`
        try
        {
            const email = this.REQ.body["email"]
            const password = this.REQ.body["password"]

            if (IsNil(email) || IsNil(password))
            {
                ResponseMessage.SendNullField({
                    expressResponse: this.RES,
                    fields: ["email", "password"],
                    log: ACTION
                })
            }

            await this.Db.ConnectPostgres()

            const login = await UserAuthService.Login({
                Db: this.Db,
                userEmail: email,
                userPassword: password
            })

            ResponseMessage.Send({
                expressResponse: this.RES,
                data: login,
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

    async RefreshToken()
    {
        const ACTION = `${ this.AppServiceAction } / Refresh de Token`
        try
        {
            const token = this.REQ.query["token"] as string

            if (IsNil(token))
            {
                ResponseMessage.SendNullField({
                    expressResponse: this.RES,
                    fields: ["token"],
                    log: ACTION
                })
            }

            await this.Db.ConnectPostgres()

            await this.AuthenticateUserRequestor()

            const refreshToken = await AuthService.ValidateJwt({
                Db: this.Db,
                token: token
            })

            ResponseMessage.Send({
                expressResponse: this.RES,
                data: refreshToken,
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

    async UserAuthorizedModules()
    {
        const ACTION = `${ this.AppServiceAction } / Módulos Autorizados ao Usuário`
        try
        {
            await this.Db.ConnectPostgres()
            await this.AuthenticateUserRequestor()

            const authorizedModules = await UserAuthService.UserAuthorizedModules({
                Db: this.Db,
                user: this.UserAuth!
            })

            ResponseMessage.Send({
                expressResponse: this.RES,
                data: authorizedModules,
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
import AppServiceBase from "../base/AppServiceBase"
import AuthService from "../../services/auth/AuthService"
import ResponseMessage from "../../classes/system/ResponseMessage"
import UserAuthService from "../../services/auth/UserAuthService"

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
            const email = this.GetReqBodyValue("email")
            const password = this.GetReqBodyValue("password")

            if (IsNil(email) || IsNil(password))
            {
                await ResponseMessage.SendNullField({
                    expressResponse: this.RES,
                    fields: ["email", "password"],
                    responseLog: ACTION
                })
            }

            await this.Db.ConnectPostgres()

            const login = await UserAuthService.Login({
                Db: this.Db,
                userEmail: email!,
                userPassword: password!
            })

            await ResponseMessage.Success({
                responseData: login,
                responseLog: ACTION,
                expressResponse: this.RES
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            await ResponseMessage.InternalServerError({
                responseData: (ex as Error).message,
                responseLog: ACTION,
                expressResponse: this.RES
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
                await ResponseMessage.SendNullField({
                    expressResponse: this.RES,
                    fields: ["token"],
                    responseLog: ACTION
                })
            }

            await this.Db.ConnectPostgres()
            await this.AuthenticateUserRequestor()
            await this.ValidateUserRequestor({})

            const refreshToken = await AuthService.ValidateJwt({
                Db: this.Db,
                token: token
            })

            await ResponseMessage.Success({
                responseData: refreshToken,
                responseLog: ACTION,
                expressResponse: this.RES
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            await ResponseMessage.InternalServerError({
                responseData: (ex as Error).message,
                responseLog: ACTION,
                expressResponse: this.RES
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
            await this.ValidateUserRequestor({})

            const authorizedModules = await UserAuthService.UserAuthorizedModules({
                Db: this.Db,
                user: this.UserAuth!
            })

            await ResponseMessage.Success({
                responseData: authorizedModules,
                responseLog: ACTION,
                expressResponse: this.RES
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            await ResponseMessage.InternalServerError({
                responseData: (ex as Error).message,
                responseLog: ACTION,
                expressResponse: this.RES
            })
        }
    }
}
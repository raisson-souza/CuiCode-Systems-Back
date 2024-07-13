import AppServiceBase from "../base/AppServiceBase"
import ResponseMessage from "../../classes/system/ResponseMessage"
import UsersAccountRecoveryService from "../../services/users/UsersAccountRecoveryService"
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
                    responseLog: ACTION
                })
            }

            await this.Db.ConnectPostgres()

            await UsersAccountService.ApproveEmail({
                Db: this.Db,
                userEmail: userEmail,
                userId: Number.parseInt(userId),
            })

            await ResponseMessage.Success({
                responseData: "Email aprovado com sucesso.",
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

    async SendEmailApproval()
    {
        const ACTION = `${ this.AppServiceAction } / Envio de Aprovação de Email`
        try
        {
            await this.Db.ConnectPostgres()
            await this.AuthenticateUserRequestor()
            await this.ValidateUserRequestor({})

            await UsersAccountService.SendEmailApproval({
                Db: this.Db,
                isCreation: false,
                user: this.UserAuth!
            })

            await ResponseMessage.Success({
                responseData: "Solicitação de aprovação de email enviada com sucesso.",
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

    async UpdatePassword()
    {
        const ACTION = `${ this.AppServiceAction } / Atualização de Senha de Usuário`
        try
        {
            await this.Db.ConnectPostgres()
            await this.AuthenticateUserRequestor()
            await this.ValidateUserRequestor({})

            const userId = Number.parseInt(this.GetReqBodyValue("user_id") ?? "")
            const password = this.GetReqBodyValue("password")
            const passwordHint = this.GetReqBodyValue("password_hint")

            if (IsNil(userId) || IsNil(password) || IsNil(passwordHint))
            {
                await ResponseMessage.SendNullField({
                    expressResponse: this.RES,
                    fields: ["user_id", "password", "password_hint"],
                    responseLog: ACTION
                })
            }

            await UsersAccountService.UpdatePassword({
                Db: this.Db,
                isAdmChange: this.UserAuth!.Id != userId,
                modifiedBy: this.UserAuth!.Id,
                password: password!,
                passwordHint: passwordHint!,
                userId: userId
            })

            await ResponseMessage.Success({
                responseData: "Senha e dica de senha atualizadas com sucesso.",
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

    async AccountRecovery()
    {
        const ACTION = `${ this.AppServiceAction } / Solicitação de Recuperação de Conta`
        try
        {
            await this.AuthenticateSystemRequestor()
            await this.Db.ConnectPostgres()

            const email = this.REQ.query["email"] as string

            if (IsNil(email))
            {
                await ResponseMessage.SendNullField({
                    expressResponse: this.RES,
                    fields: ["email"],
                    responseLog: ACTION,
                })
            }

            await UsersAccountService.AccountRecovery({
                Db: this.Db,
                email: email
            })

            await ResponseMessage.Success({
                responseData: `Solicitação de recuperação de conta criada com sucesso, verifique o email ${ email }`,
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

    async ConfirmAccountRecovery()
    {
        const ACTION = `${ this.AppServiceAction } / Confirmação de Recuperação de Conta`
        try
        {
            await this.AuthenticateSystemRequestor()
            await this.Db.ConnectPostgres()

            const userNewPassword = this.GetReqBodyValue("new_password")
            const userNewPasswordHint = this.GetReqBodyValue("new_password_hint")
            const jwt = this.REQ.query["jwt"] as string

            if (IsNil(userNewPassword) || IsNil(userNewPasswordHint) || IsNil(jwt))
            {
                await ResponseMessage.SendInvalidField({
                    expressResponse: this.RES,
                    fields: ["userNewPassword", "userNewPasswordHint", "jwt"],
                    responseLog: ACTION
                })
            }

            await UsersAccountService.ConfirmAccountRecovery({
                Db: this.Db,
                userNewPassword: userNewPassword!,
                userNewPasswordHint: userNewPasswordHint!,
                recoveryJwt: jwt
            })

            await ResponseMessage.Success({
                responseData: "Conta restaurada com sucesso.",
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

    async VerifyAccountRecovery()
    {
        type VerifyAccountRecoveryReturn = {
            exists : boolean
            error? : string
        }
        const ACTION = `${ this.AppServiceAction } / Verificação de Solicitação de Recuperação de Conta`
        try
        {
            await this.AuthenticateSystemRequestor()
            await this.Db.ConnectPostgres()

            const jwt = this.REQ.query["jwt"] as string

            if (IsNil(jwt))
            {
                await ResponseMessage.SendInvalidField({
                    expressResponse: this.RES,
                    fields: ["jwt"],
                    responseLog: ACTION
                })
            }

            const userAccountRestorations = await UsersAccountRecoveryService.GetByJwt({
                Db: this.Db,
                jwt: jwt
            })

            if (userAccountRestorations.length > 0)
            {
                const activeUserAccountRestoration = userAccountRestorations.filter(userAccountRestoration => {
                    return !userAccountRestoration.Completed && !userAccountRestoration.Expired
                })[0]

                if (
                    !activeUserAccountRestoration.Completed &&
                    !activeUserAccountRestoration.Expired
                )
                {
                    await ResponseMessage.Send({
                        expressResponse: this.RES,
                        responseData: { exists: true } as VerifyAccountRecoveryReturn,
                        responseLog: ACTION,
                        responseStatus: HttpStatusEnum.OK
                    })
                }
                else
                {
                    await ResponseMessage.Send({
                        expressResponse: this.RES,
                        responseData: {
                            exists: true,
                            error: "Solicitação de recuperação de conta expirada, tente novamente."
                        } as VerifyAccountRecoveryReturn,
                        responseLog: ACTION,
                        responseStatus: HttpStatusEnum.UNAVAIALBLE
                    })
                }
            }

            const data : VerifyAccountRecoveryReturn = {
                exists: false,
                error: "Solicitação de recuperação de conta inexistente, verifique o token."
            }

            await ResponseMessage.Success({
                responseData: data,
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
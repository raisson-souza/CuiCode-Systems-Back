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

    async AccountRecovery()
    {
        const ACTION = `${ this.AppServiceAction } / Solicitação de Recuperação de Conta`
        try
        {
            await this.Db.ConnectPostgres()

            const email = this.REQ.query["email"] as string

            if (IsNil(email))
            {
                ResponseMessage.SendNullField({
                    expressResponse: this.RES,
                    fields: ["email"],
                    log: ACTION,
                })
            }

            await UsersAccountService.AccountRecovery({
                Db: this.Db,
                email: email
            })

            ResponseMessage.Send({
                expressResponse: this.RES,
                data: `Solicitação de recuperação de conta criada com sucesso, verifique o email ${ email }`,
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
        const ACTION = `${ this.AppServiceAction } / Confirmação de Recuperação de Conta`
        try
        {
            await this.Db.ConnectPostgres()

            const userNewPassword = this.REQ.body["new_password"] //att doc
            const userNewPasswordHint = this.REQ.body["new_password_hint"]
            const jwt = this.REQ.query["jwt"] as string

            if (IsNil(userNewPassword) || IsNil(userNewPasswordHint) || IsNil(jwt))
            {
                ResponseMessage.SendInvalidField({
                    expressResponse: this.RES,
                    fields: ["userNewPassword", "userNewPasswordHint", "jwt"],
                    log: ACTION
                })
            }

            await UsersAccountService.ConfirmAccountRecovery({
                Db: this.Db,
                userNewPassword: userNewPassword,
                userNewPasswordHint: userNewPasswordHint,
                recoveryJwt: jwt
            })

            ResponseMessage.Send({
                expressResponse: this.RES,
                data: "Conta restaurada com sucesso.",
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

    async VerifyAccountRecovery()
    {
        type VerifyAccountRecoveryReturn = {
            exists : boolean
            error? : string
        }
        const ACTION = `${ this.AppServiceAction } / Verificação de Solicitação de Recuperação de Conta`
        try
        {
            await this.Db.ConnectPostgres()

            const jwt = this.REQ.query["jwt"] as string

            if (IsNil(jwt))
            {
                ResponseMessage.SendInvalidField({
                    expressResponse: this.RES,
                    fields: ["jwt"],
                    log: ACTION
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
                    ResponseMessage.Send({
                        expressResponse: this.RES,
                        data: { exists: true } as VerifyAccountRecoveryReturn,
                        log: ACTION,
                        status: HttpStatusEnum.OK
                    })
                }
                else
                {
                    ResponseMessage.Send({
                        expressResponse: this.RES,
                        data: {
                            exists: true,
                            error: "Solicitação de recuperação de conta expirada, tente novamente."
                        } as VerifyAccountRecoveryReturn,
                        log: ACTION,
                        status: HttpStatusEnum.UNAVAIALBLE
                    })
                }
            }

            ResponseMessage.Send({
                expressResponse: this.RES,
                data: {
                    exists: false,
                    error: "Solicitação de recuperação de conta inexistente, verifique o token."
                } as VerifyAccountRecoveryReturn,
                log: ACTION,
                status: HttpStatusEnum.NOT_FOUND
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
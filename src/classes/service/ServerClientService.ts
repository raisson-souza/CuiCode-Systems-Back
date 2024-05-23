import env from "../../config/Env"

import QueryUser from "../../services/user/utilities/QueryUser"

import Service from "./base/Service"

import ResponseMessage from "../system/ResponseMessage"
import UserAuth from "../entities/user/UserAuth"
import UserRepository from "../../repositories/UserRepository"

import EncryptInfo from "../../functions/security/EncryptPassword"
import IsUndNull from "../../functions/logic/IsUndNull"
import PermissionLevelToNumber from "../../functions/enums/PermissionLevelToNumber"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"
import PermissionLevelEnum from "../../enums/PermissionLevelEnum"

abstract class ServerClientService extends Service
{
    IsSystemRequestor : boolean
    SameUserAuthAndUserToOperate : boolean

    abstract Operation() : void

    /**
     * Realiza a autenticação do sistema ou do usuário requeridor.
     */
    async AuthenticateRequestor()
    {
        try
        {
            const reqAuths = this.GetAuthentications()

            if (!IsUndNull(reqAuths.SystemKey))
            {
                this.AuthenticateServerRequestor(reqAuths.SystemKey)
                return
            }

            if (!IsUndNull(reqAuths.UserAuthId))
            {
                await this.AuthenticateUserRequestor(reqAuths.UserAuthId)
                return
            }

            ResponseMessage.UnauthorizedUser({
                expressResponse: this.RES,
                log: this.Action
            })
        }
        catch (ex)
        {
            ResponseMessage.Send({
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR,
                data: `Ocorreu um erro na autenticação. Erro: ${ (ex as Error).message }`,
                log: this.Action,
                expressResponse: this.RES
            })
        }
    }

    /**
     * Realiza a autenticação do sistema.
    */
    private AuthenticateServerRequestor(systemKey : string | null)
    {
        const encryptedKey = EncryptInfo(systemKey)

        if (encryptedKey != env.SystemJwt()) {
            ResponseMessage.UnauthorizedUser({
                expressResponse: this.RES,
                log: this.Action
            })
        }

        this.IsSystemRequestor = true
        this.SameUserAuthAndUserToOperate = false
        this.USER_auth = null
    }

    /**
     * Realiza a autenticação do usuário.
     * É necessário ser chamado em fluxos que exigem autenticação.
     */
    private async AuthenticateUserRequestor(userAuthId : string | null)
    {
        if (IsUndNull(userAuthId)) {
            ResponseMessage.SendNullField({
                expressResponse: this.RES,
                fields: ["userAuthId"],
                log: this.Action
            })
        }

        const user = await Promise.resolve(
            QueryUser(this.DB_connection, Number.parseInt(userAuthId!)))
                .then(user => {
                    return new UserAuth(user, this.REQ.headers)
                })
                .catch(ex => {
                    if ((ex as Error).message === "Nenhum usuário encontrado.")
                    {
                        ResponseMessage.Send({
                            status: HttpStatusEnum.NOT_FOUND,
                            data: "Usuário requeridor não encontrado.",
                            log: this.Action,
                            expressResponse: this.RES
                        })
                    }

                    throw new Error((ex as Error).message)
                })

        UserRepository.ValidateUserValidity(user)

        this.USER_auth = user
        this.IsSystemRequestor = false
    }

    /**
     * Realiza a validação do usuário autenticado.
     */
    ValidateRequestor
    (
        level : PermissionLevelEnum = PermissionLevelEnum.Member,
        userIdToOperate : number | null = null,
        allowDifferentUserAuthAndUserToOperate : boolean = false
    )
    {
        if (this.IsSystemRequestor)
            return

        UserRepository.ValidateUserPermission(this.USER_auth!, level)

        if (!IsUndNull(userIdToOperate))
        {
            if (this.USER_auth!.Id != userIdToOperate)
            {
                this.SameUserAuthAndUserToOperate = false
                if
                (
                    allowDifferentUserAuthAndUserToOperate ||
                    this.USER_auth!.PermissionLevel!.Value! >= PermissionLevelToNumber(PermissionLevelEnum.Adm)
                )
                    return
                ResponseMessage.ProhibitedOperation({
                    expressResponse: this.RES,
                    log: this.Action
                })
            }
            this.SameUserAuthAndUserToOperate = true
        }
    }
}

export default ServerClientService
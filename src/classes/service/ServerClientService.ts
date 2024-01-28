import Env from "../../config/environment"

import QueryUser from "../../services/user/utilities/QueryUser"

import Service from "./base/Service"
import UserAuth from "../UserAuth"

import EncryptPassword from "../../functions/EncryptPassword"
import IsUndNull from "../../functions/IsUndNull"
import PermissionLevelToNumber from "../../functions/enums/PermissionLevelToNumber"
import Send from "../../functions/system/Send"

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
            const reqAuths = this.GetAutentications()

            if (!IsUndNull(reqAuths.SystemKey))
            {
                this.AuthenticateServerRequestor()
                return
            }

            if (!IsUndNull(reqAuths.UserAuthId))
            {
                await this.AuthenticateUserRequestor()
                return
            }
            throw new Error("Nenhuma autenticação encontrada.")
        }
        catch (ex)
        {
            Send.Unauthorized(this.RES, `Ocorreu um erro na autenticação. Erro: ${ (ex as Error).message }`, this.Action)
        }
    }

    /**
     * Realiza a autenticação do sistema.
    */
    private AuthenticateServerRequestor()
    {
        const key = this.GetAutentications().SystemKey

        const encryptedKey = EncryptPassword(IsUndNull(key) ? "" : key!)

        if (encryptedKey != Env.SystemUserKey)
            throw new Error("Sistema não autenticado.")

        this.IsSystemRequestor = true
        this.SameUserAuthAndUserToOperate = false
        this.USER_auth = null
    }

    /**
     * Realiza a autenticação do usuário.
     * É necessário ser chamado em fluxos que exigem autenticação.
     */
    private async AuthenticateUserRequestor()
    {
        const userAuthId = this.GetAutentications().UserAuthId

        if (IsUndNull(userAuthId))
            throw new Error("Usuário requeridor não encontrado na requisição.")

        const user = await Promise.resolve(
            QueryUser(this.DB_connection, Number.parseInt(userAuthId!)))
                .then(user => {
                    return new UserAuth(user, this.REQ.headers)
                })
                .catch(ex => {
                    if ((ex as Error).message === "Nenhum usuário encontrado.")
                    {
                        Send.NotFound(this.RES, "Usuário requeridor não encontrado.", this.Action)
                        throw new Error("Usuário requeridor não encontrado.")
                    }

                    throw new Error((ex as Error).message)
                })

        user.CheckUserValidity()

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

        this.USER_auth!.CheckUserPermission(level)

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
                Send.Unauthorized(this.RES, "Usuário não autorizado para tal ação.", this.Action)
                throw new Error("Usuário não autorizado para tal ação.")
            }
            this.SameUserAuthAndUserToOperate = true
        }
    }
}

export default ServerClientService
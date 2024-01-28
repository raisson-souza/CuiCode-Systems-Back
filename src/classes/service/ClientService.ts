import QueryUser from "../../services/user/utilities/QueryUser"

import Service from "./base/Service"
import UserAuth from "../UserAuth"

import IsUndNull from "../../functions/IsUndNull"
import PermissionLevelToNumber from "../../functions/enums/PermissionLevelToNumber"
import Send from "../../functions/system/Send"

import PermissionLevelEnum from "../../enums/PermissionLevelEnum"

abstract class ClientService extends Service
{
    SameUserAuthAndUserToOperate : boolean

    abstract Operation() : void

    /**
     * Realiza a autenticação do usuário.
     * É necessário ser chamado em fluxos que exigem autenticação.
     */
    async AuthenticateRequestor()
    {
        const userAuthId = this.CheckUserAuthId()

        const user = await Promise.resolve(
            QueryUser(this.DB_connection, userAuthId))
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

    private CheckUserAuthId() : number
    {
        const userAuthId = this.GetAutentications().UserAuthId

        if (IsUndNull(userAuthId))
            throw new Error("Usuário requeridor não encontrado na requisição.")

        return Number.parseInt(userAuthId!)
    }
}

export default ClientService
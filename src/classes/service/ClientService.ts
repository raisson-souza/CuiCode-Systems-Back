import { Request, Response } from "express"

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

    constructor(req : Request, res : Response) { super(req, res) }

    abstract Operation() : void

    /**
     * Collects UserAuthId info on request.
     * Requires call upon restricted level services.
     * @sendHeaders Parâmetro especial para a classe ServerClientService
     */
    async AuthenticateRequestor
    (
        userIdToOperate : number | null = null,
        level : PermissionLevelEnum = PermissionLevelEnum.Member,
        allowDifferentUserAuthAndUserToOperate : boolean = false,
        sendHeaders : boolean = true
    )
    {
        const userAuthId = this.CheckUserAuthId()

        const user = await Promise.resolve(
            QueryUser(this.DB_connection, userAuthId))
                .then(user => {
                    return new UserAuth(user, false, this.REQ.headers)
                })
                .catch(ex => {
                    if ((ex as Error).message === "Nenhum usuário encontrado.")
                    {
                        if (sendHeaders)
                            Send.NotFound(this.RES, "Usuário requeridor não encontrado.", this.Action)
                        throw new Error("Usuário requeridor não encontrado.")
                    }

                    if (sendHeaders)
                        Send.Error(this.RES, (ex as Error).message, this.Action)
                    throw new Error((ex as Error).message)
                })

        user.CheckUserValidity()

        user.CheckUserPermission(level)

        this.USER_auth = user

        if (!IsUndNull(userIdToOperate))
        {
            if (this.USER_auth.Id != userIdToOperate)
            {
                this.SameUserAuthAndUserToOperate = false
                if
                (
                    this.USER_auth?.PermissionLevel?.Value! >= PermissionLevelToNumber(PermissionLevelEnum.Adm) &&
                    !allowDifferentUserAuthAndUserToOperate
                )
                {
                    if (sendHeaders)
                        Send.Unauthorized(this.RES, "Usuário não autorizado para tal ação.", this.Action)
                    throw new Error("Usuário não autorizado para tal ação.")
                }
                return
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
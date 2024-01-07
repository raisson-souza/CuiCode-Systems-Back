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
    constructor(req : Request, res : Response) { super(req, res) }

    abstract Operation() : void

    /**
     * Collects UserAuthId info on request.
     * Requires call upon restricted level services.
     */
    async AuthenticateRequestor
    (
        userIdToOperate : number | null = null,
        level : PermissionLevelEnum = PermissionLevelEnum.Member,
    )
    {
        const userAuthId = this.CheckUserAuthId()

        const user = await Promise.resolve(
            QueryUser(this.DB_connection, userAuthId))
                .then(user => {
                    return new UserAuth(user, false, this.REQ.headers)
                })
                .catch(ex => {
                    throw new Error(ex.message)
                })

        user.CheckUserPermission(level)

        this.USER_auth = user

        if (!IsUndNull(userIdToOperate))
        {
            if
            (
                this.USER_auth?.Id != userIdToOperate &&
                this.USER_auth?.PermissionLevel?.Value! >= PermissionLevelToNumber(PermissionLevelEnum.Adm)
            )
            {
                Send.Unauthorized(this.RES, "Usuário não autorizado para tal ação.", this.Action)
                throw new Error("Usuário não autorizado para tal ação.")
            }
        }
    }

    private CheckUserAuthId() : number
    {
        const userIdInBody  = this.REQ.body.UserAuthId
        if (!IsUndNull(userIdInBody))
            return userIdInBody

        const userIdInQuery = Number.parseInt(this.REQ.query.UserAuthId as string)
        if (!IsUndNull(userIdInQuery))
            return userIdInQuery

        throw new Error("Usuário requeridor não encontrado na requisição.")
    }
}

export default ClientService
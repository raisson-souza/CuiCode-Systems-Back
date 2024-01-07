import { Request, Response } from "express"

import QueryUser from "../../services/user/utilities/QueryUser"

import Service from "./base/Service"
import UserAuth from "../UserAuth"

import IsUndNull from "../../functions/IsUndNull"

import PermissionLevelEnum from "../../enums/PermissionLevelEnum"

abstract class ClientService extends Service
{
    constructor(req : Request, res : Response) { super(req, res) }

    abstract Operation() : void

    /**
     * Collects UserAuthId info on request.
     * Requires call upon restricted level services.
     */
    async AuthenticateRequestor(level : PermissionLevelEnum = PermissionLevelEnum.Member)
    {
        const userAuthId = this.CheckUserAuthId()

        const user = await Promise.resolve(
            QueryUser(this.DB_connection, userAuthId))
                .then(user => {
                    return new UserAuth(user, true, this.REQ.headers)
                })
                .catch(ex => {
                    throw new Error(ex.message)
                })

        user.CheckUserPermission(level)

        this.USER_auth = user
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
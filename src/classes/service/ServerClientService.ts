import { Request, Response } from "express"

import ClientService from "./ClientService"
import ServerService from "./ServerService"
import Service from "./base/Service"

import IsUndNull from "../../functions/IsUndNull"

import PermissionLevelEnum from "../../enums/PermissionLevelEnum"

abstract class ServerClientService extends Service
{
    constructor(req : Request, res : Response) { super(req, res) }

    abstract Operation() : void

    /**
     * Upon call, if there is PermissionLevel, runs ClientService, otherwise runs ServerService.
     * At all ServerClientService services, pass UserAuthPermissionLevel or null.
     */
    async AuthenticateRequestor(userIdToOperate : number | null = null, level : PermissionLevelEnum | null = PermissionLevelEnum.Member)
    {
        if (IsUndNull(level))
        {
            const serverServiceClass = ServerService
            serverServiceClass.prototype.REQ = this.REQ
            return serverServiceClass.prototype.AuthenticateRequestor()
        }

        const clientServiceClass = ClientService
        clientServiceClass.prototype.REQ = this.REQ
        clientServiceClass.prototype.DB_connection = this.DB_connection
        return await clientServiceClass.prototype.AuthenticateRequestor(userIdToOperate, level!)
    }
}

export default ServerClientService
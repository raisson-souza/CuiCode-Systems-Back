import { Request, Response } from "express"

import Env from "../../config/environment"

import Service from "./base/Service"

import EncryptPassword from "../../functions/EncryptPassword"
import IsUndNull from "../../functions/IsUndNull"
import Send from "../../functions/system/Send"

import PermissionLevelEnum from "../../enums/PermissionLevelEnum"

abstract class ServerService extends Service
{
    constructor(req : Request, res : Response) { super(req, res) }

    abstract Operation() : void

    /**
     * Performs system authentication.
     * Needs to be called.
     */
    AuthenticateRequestor
    (
        _ : number | null = null,
        __ : PermissionLevelEnum | null = null,
        sendHeaders : boolean = true
    )
    {
        const key = this.GetAutentications().SystemKey

        const encryptedKey = EncryptPassword(IsUndNull(key) ? "" : key!)

        if (encryptedKey != Env.SystemUserKey)
        {
            if (sendHeaders)
                Send.Unauthorized(this.RES, "Sistema não autenticado.", this.Action)
            throw new Error("Sistema não autenticado.")
        }

        this.USER_auth = null
    }
}

export default ServerService
import { Request, Response } from "express"

import Env from "../../config/environment"

import Service from "./base/Service"

import EncryptPassword from "../../functions/EncryptPassword"
import Send from "../../functions/system/Send"

abstract class ServerService extends Service
{
    constructor(req : Request, res : Response) { super(req, res) }

    abstract Operation() : void

    /**
     * Performs system authentication.
     * Needs to be called.
     */
    AuthenticateRequestor()
    {
        const key : string = this.REQ.method === "GET"
            ? this.REQ.query["SystemKey"]
            : this.REQ.body["SystemKey"]

        const encryptedKey = EncryptPassword(key)

        if (encryptedKey != Env.SystemUserKey)
        {
            Send.Unauthorized(this.RES, "Sistema não autenticado.", this.Action)
            throw new Error("Sistema não autenticado.")
        }

        this.USER_auth = null
    }
}

export default ServerService
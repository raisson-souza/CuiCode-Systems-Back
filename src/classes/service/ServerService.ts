import Env from "../../config/Env"

import ResponseMessage from "../system/ResponseMessage"
import Service from "./base/Service"

import EncryptInfo from "../../functions/security/EncryptPassword"

abstract class ServerService extends Service
{
    abstract Operation() : void

    /**
     * Realiza a autenticação do sistema.
    */
    AuthenticateRequestor()
    {
        const key = this.GetAuthentications().SystemKey

        const encryptedKey = EncryptInfo(key)

        if (encryptedKey != Env.SystemKey)
            ResponseMessage.UnauthorizedSystem(this.RES, this.Action)

        this.USER_auth = null
    }

    ValidateRequestor() {}
}

export default ServerService
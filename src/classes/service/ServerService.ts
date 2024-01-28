import Env from "../../config/environment"

import Service from "./base/Service"

import EncryptInfo from "../../functions/EncryptPassword"

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

        if (encryptedKey != Env.SystemUserKey)
            throw new Error("Sistema não autenticado.")

        this.USER_auth = null
    }

    ValidateRequestor() {}
}

export default ServerService
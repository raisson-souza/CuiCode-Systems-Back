import Env from "../../config/environment"

import Service from "./base/Service"

import EncryptPassword from "../../functions/EncryptPassword"
import IsUndNull from "../../functions/IsUndNull"

abstract class ServerService extends Service
{
    abstract Operation() : void

    /**
     * Realiza a autenticação do sistema.
    */
    AuthenticateRequestor()
    {
        const key = this.GetAutentications().SystemKey

        const encryptedKey = EncryptPassword(IsUndNull(key) ? "" : key!)

        if (encryptedKey != Env.SystemUserKey)
            throw new Error("Sistema não autenticado.")

        this.USER_auth = null
    }

    ValidateRequestor() {}
}

export default ServerService
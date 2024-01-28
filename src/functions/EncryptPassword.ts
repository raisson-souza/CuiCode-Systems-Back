import crypto from "crypto-js"

import IsUndNull from "./IsUndNull"

/**
 * Função de criptografia de senha baseado em criptografia MD5.
 */
function EncryptInfo(info : string | null | undefined) : string
{
    if (IsUndNull(info))
        info = ""

    return crypto.MD5(info!).toString()
}

export default EncryptInfo
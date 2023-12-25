import crypto from "crypto-js"

/**
 * Função de criptografia de senha baseado em criptografia MD5.
 */
function EncryptPassword(password : string) : string
{
    return crypto.MD5(password).toString()
}

export default EncryptPassword
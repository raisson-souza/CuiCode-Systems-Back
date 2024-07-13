import { Request } from "express"

type JwtPrinterProps = {
    req : Request,
    credential : string,
    /** Chave referente ao valor da credencial. */
    credentialKey : string
}

/**
 * Grava o valor de uma credencial na requisição.
 */
export default function JwtPrinter(props : JwtPrinterProps)
{
    const { req, credential, credentialKey } = props

    if (req.method == "GET")
        req.query[credentialKey] = credential
    else
        req.body[credentialKey] = credential
}
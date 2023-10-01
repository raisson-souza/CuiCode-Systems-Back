import { Request, Response } from "firebase-functions"
import HttpStatus from "../enums/HttpStatusEnum"
import Send from "./Responses"

/**
 * Validates a enpoint request methods.
 * Returns true if successful, false otherwise.
 * @param res Response
 * @param req Request
 * @param methods Methods expected
 * @returns 
 */
export default function ValidateMethod
(
    res : Response,
    req : Request,
    methods : Array<string>
)
: boolean
{
    if (!methods.includes(req.method))
    {
        Send.MethodNotAllowed(res, "Método não autorizado.", "Validação de Método")
        return false
    }

    return true
}
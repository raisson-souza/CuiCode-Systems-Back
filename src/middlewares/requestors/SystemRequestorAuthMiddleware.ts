import {
    NextFunction,
    Request,
    Response,
} from "express"

import ResponseMessage from "../../classes/system/ResponseMessage"

import IsUndNull from "../../functions/logic/IsUndNull"
import JwtDecoder from "../functions/JwtDecoder"
import JwtParser from "../functions/JwtParser"
import JwtPrinter from "../functions/JwtPrinter"

const ACTION = "Middleware de Requeridor Sistema"

/** Middleware de autenticação do requeridor sistema. */
export default async function SystemRequestorAuthMiddleware
(
    req : Request,
    res : Response,
    next : NextFunction
)
: Promise<void>
{
    try
    {
        const { authorization } = req.headers

        if (IsUndNull(authorization)) {
            await ResponseMessage.UnauthorizedSystem({
                expressResponse: res,
                responseLog: ACTION
            })
        }

        const token = JwtParser(authorization!)

        const systemKey = await JwtDecoder({
            res: res,
            token: token,
            action: ACTION,
            tokenKey: "SystemKey"
        })

        JwtPrinter({
            req: req,
            credential: systemKey,
            credentialKey: "SystemKey"
        })

        next()
    }
    catch (ex)
    {
        await ResponseMessage.InternalServerError({
            responseData: (ex as Error).message,
            responseLog: ACTION,
            expressResponse: res
        })
    }
}
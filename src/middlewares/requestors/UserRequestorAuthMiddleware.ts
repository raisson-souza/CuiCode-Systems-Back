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

const ACTION = "Middleware de Requeridor Usuário"

/** Middleware de autenticação do requeridor usuário. */
export default async function UserRequestorAuthMiddleware
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
            await ResponseMessage.UnauthorizedUser({
                expressResponse: res,
                responseLog: ACTION
            })
        }

        const token = JwtParser(authorization!)

        const userAuthId = await JwtDecoder({
            res: res,
            token: token,
            action: ACTION,
            tokenKey: "UserAuthId"
        })

        JwtPrinter({
            req: req,
            credential: userAuthId,
            credentialKey: "UserAuthId"
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
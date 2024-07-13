import {
    NextFunction,
    Request,
    Response,
} from "express"
import { verify } from "jsonwebtoken"

import env from "../config/Env"

import ResponseMessage from "../classes/system/ResponseMessage"

import IsUndNull from "../functions/logic/IsUndNull"

/** DEPRECATED! */
async function AuthMiddleware
(
    req : Request,
    res : Response,
    next : NextFunction
)
: Promise<void>
{
    const ACTION = "AuthMiddleware"
    try
    {
        const cors = require("cors")({ origin: env.AllowedOrigins() })

        if (
            (
                req.header("Origin") ||
                IsUndNull(req.header("Origin"))
            ) &&
            !env.AllowedOrigins().includes(req.header("Origin")!)
        )
        {
            const { authorization } = req.headers

            if (IsUndNull(authorization)) {
                await ResponseMessage.UnauthorizedUser({
                    expressResponse: res,
                    responseLog: ACTION
                })
            }

            const token = authorization!.split(" ")[1]!

            const decoded = verify(token,  env.JwtSecret())
            const id = (decoded as any)["id"]
            // Para a credencial do sistema é necessário enviar crua do front
            const systemKey = (decoded as any)["system_key"]

            if (req.method == "GET")
            {
                req.query["UserAuthId"] = id
                req.query["SystemKey"] = systemKey
            }
            else
            {
                req.body["UserAuthId"] = id
                req.body["SystemKey"] = systemKey
            }
        }

        cors(req, res, () => {
            res.set("Access-Control-Allow-Origin", req.get("Origin"));
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

export default AuthMiddleware
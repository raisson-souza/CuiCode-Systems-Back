import {
    NextFunction,
    Request,
    Response,
} from "express"
import env from "../config/Env"

import ResponseMessage from "../classes/system/ResponseMessage"

import IsUndNull from "../functions/logic/IsUndNull"

import HttpStatusEnum from "../enums/system/HttpStatusEnum"

const ACTION = "Middleware de Origem"

/** Middleware de autenticação de origem. */
export default async function OriginAuthMiddleware
(
    req : Request,
    res : Response,
    next : NextFunction
)
: Promise<void>
{
    try
    {
        const allowedOrigins = env.AllowedOrigins()

        const cors = require("cors")({
            origin: allowedOrigins.length > 0
                ? allowedOrigins
                : ''
        })

        if (
            IsUndNull(req.header("Origin")) ||
            !allowedOrigins.includes(req.header("Origin") ?? "")
        )
        {
            if (!env.IsDevelopment())
            {
                await ResponseMessage.Send({
                    responseStatus: HttpStatusEnum.UNAUTHORIZED,
                    responseData: "Origem de requisição não autorizada.",
                    responseLog: ACTION,
                    expressResponse: res
                })
                throw new Error("Origem de requisição não autorizada.")
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
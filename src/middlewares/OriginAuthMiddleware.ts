import {
    NextFunction,
    Request,
    Response,
} from "express"
import env from "../config/Env"

import Exception from "../classes/custom/Exception"
import ResponseMessage from "../classes/system/ResponseMessage"

import IsUndNull from "../functions/logic/IsUndNull"

import HttpStatusEnum from "../enums/system/HttpStatusEnum"

const ACTION = "OriginAuthMiddleware"
async function OriginAuthMiddleware
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
                : '*'
        })

        if (
            (
                IsUndNull(req.header("Origin")) ||
                !allowedOrigins.includes(req.header("Origin")!)
            )
        )
        {
            if (!env.PostManTestingException())
                throw new Error("Origem de requisição não autorizada.")
        }

        cors(req, res, () => {
            res.set("Access-Control-Allow-Origin", req.get("Origin"));
        })
    
        next()
    }
    catch (ex)
    {
        ResponseMessage.Send({
            status: HttpStatusEnum.INTERNAL_SERVER_ERROR,
            data: `Erro na autenticação de origem: ${ (ex as Error).message }`,
            log: ACTION,
            expressResponse: res
        })
        Exception.UnexpectedError((ex as Error).message, ACTION)
    }
}

export default OriginAuthMiddleware
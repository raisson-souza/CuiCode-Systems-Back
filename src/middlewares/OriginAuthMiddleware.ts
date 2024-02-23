import {
    NextFunction,
    Request,
    Response,
} from "express"

import Env from "../config/environment"

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
        const {
            Allowed_origins,
            PostManTestingException
        } = Env

        const cors = require("cors")({ origin: Allowed_origins })

        if (
            (
                IsUndNull(req.header("Origin")) ||
                !Allowed_origins.includes(req.header("Origin")!)
            )
        )
        {
            if (!PostManTestingException)
                throw new Error("Origem de requisição não autorizada.")
        }

        cors(req, res, () => {
            res.set("Access-Control-Allow-Origin", req.get("Origin"));
        })
    
        next()
    }
    catch (ex)
    {
        ResponseMessage.Send(
            HttpStatusEnum.INTERNAL_SERVER_ERROR,
            `Erro na autenticação de origem: ${ (ex as Error).message }`,
            ACTION,
            res
        )
        Exception.UnexpectedError((ex as Error).message, ACTION)
    }
}

export default OriginAuthMiddleware
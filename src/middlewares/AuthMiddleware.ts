import {
    NextFunction,
    Request,
    Response,
} from "express"
import { verify } from "jsonwebtoken"

import Env from "../config/environment"

import Exception from "../classes/custom/Exception"
import ResponseMessage from "../classes/system/ResponseMessage"

import IsUndNull from "../functions/logic/IsUndNull"

import HttpStatusEnum from "../enums/system/HttpStatusEnum"

// AUTHMIDDLEWARE NÃO SERÁ MAIS USADO!
async function AuthMiddleware
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
        } = Env
    
        const cors = require("cors")({ origin: Allowed_origins })
    
        if (
            (
                req.header("Origin") ||
                IsUndNull(req.header("Origin"))
            ) &&
            !Allowed_origins.includes(req.header("Origin")!)
        )
        {
            const { authorization } = req.headers

            if (IsUndNull(authorization))
                ResponseMessage.UnauthorizedUser(res, "AuthMiddleware")

            const token = authorization!.split(" ")[1]!

            const decoded = verify(token,  Env.JWT_key)
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
        ResponseMessage.Send(
            HttpStatusEnum.INTERNAL_SERVER_ERROR,
            `Erro na autenticação: ${ (ex as Error).message }`,
            "AuthMiddleware",
            res
        )
        Exception.UnexpectedError((ex as Error).message, "AuthMiddleware")
    }
}

export default AuthMiddleware
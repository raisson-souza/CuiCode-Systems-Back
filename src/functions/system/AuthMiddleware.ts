import {
    NextFunction,
    Request,
    Response,
} from "express"
import { verify } from "jsonwebtoken"

import Env from "../../config/environment"

import ResponseMessage from "../../classes/system/ResponseMessage"

import IsUndNull from "../IsUndNull"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"

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
            allowed_origins,
        } = Env
    
        const cors = require("cors")({ origin: allowed_origins })
    
        if (
            (
                req.header("Origin") ||
                IsUndNull(req.header("Origin"))
            ) &&
            !allowed_origins.includes(req.header("Origin")!)
        )
        {
            const { authorization } = req.headers

            if (IsUndNull(authorization))
            {
                ResponseMessage.UnauthorizedUser(res, "AuthMiddleware")
                throw new Error("Usuário não autenticado.")
            }

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
    }
}

export default AuthMiddleware
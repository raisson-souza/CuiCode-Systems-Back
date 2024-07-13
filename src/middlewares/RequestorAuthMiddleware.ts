import {
    NextFunction,
    Request,
    Response,
} from "express"
import { verify } from "jsonwebtoken"

import env from "../config/Env"

import ResponseMessage from "../classes/system/ResponseMessage"

import IsUndNull from "../functions/logic/IsUndNull"

const ACTION = "RequestorAuthMiddleware"

/** DEPRECATED! */
async function RequestorAuthMiddleware
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

        const token = ParseJwt(authorization!)

        // Para a credencial do sistema é necessário enviar crua do front
        const {
            userAuthId,
            systemKey
        } = await DecodeJwt(token, res)

        PrintAuthInReq(
            req,
            userAuthId,
            systemKey
        )

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

/**
 * Captura o JWT recebido pela requisição na autenticação para ser validado pelo jsonwebtoken.
 */
function ParseJwt(jwt : string)
{
    if (jwt.includes("Bearer "))
        return jwt.split(" ")[1]

    return jwt
}

/**
 * Extrai os dados de autenticação do JWT.
 */
async function DecodeJwt
(
    jwt : string,
    res : Response
)
{
    const decoded = verify(
        jwt,
        env.JwtSecret()
    ) as any

    const userAuthId = decoded["UserAuthId"] as string
    const systemKey = decoded["SystemKey"] as string

    if (IsUndNull(userAuthId) && IsUndNull(systemKey)) {
        await ResponseMessage.NoAuthFoundInToken({
            expressResponse: res,
            responseLog: ACTION
        })
    }

    return {
        "userAuthId": userAuthId,
        "systemKey": systemKey,
    }
}

/**
 * Grava o valor das credenciais na requisição.
 */
function PrintAuthInReq
(
    req : Request,
    userId : string,
    systemKey : string
)
{
    if (req.method == "GET")
    {
        req.query["UserAuthId"] = userId
        req.query["SystemKey"] = systemKey
    }
    else
    {
        req.body["UserAuthId"] = userId
        req.body["SystemKey"] = systemKey
    }
}

export default RequestorAuthMiddleware
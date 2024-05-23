import {
    NextFunction,
    Request,
    Response,
} from "express"
import { verify } from "jsonwebtoken"

import env from "../config/Env"

import Exception from "../classes/custom/Exception"
import ResponseMessage from "../classes/system/ResponseMessage"

import IsUndNull from "../functions/logic/IsUndNull"

import HttpStatusEnum from "../enums/system/HttpStatusEnum"

const ACTION = "RequestorAuthMiddleware"
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
            ResponseMessage.UnauthorizedUser({
                expressResponse: res,
                log: ACTION
            })
        }

        const token = ParseJwt(authorization!)

        // Para a credencial do sistema é necessário enviar crua do front
        const {
            userAuthId,
            systemKey
        } = DecodeJwt(token, res)

        PrintAuthInReq(
            req,
            userAuthId,
            systemKey
        )

        next()
    }
    catch (ex)
    {
        ResponseMessage.Send({
            status: HttpStatusEnum.INTERNAL_SERVER_ERROR,
            data: `Erro na autenticação do requeridor: ${ (ex as Error).message }`,
            log: ACTION,
            expressResponse: res
        })
        Exception.UnexpectedError((ex as Error).message, ACTION)
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
function DecodeJwt
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
        ResponseMessage.NoAuthFoundInToken({
            expressResponse: res,
            log: ACTION
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
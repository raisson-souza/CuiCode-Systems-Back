import {
    NextFunction,
    Request,
    Response,
} from "express"
import { verify } from "jsonwebtoken"

import Env from "../../config/Env"

import Exception from "../../classes/custom/Exception"
import ResponseMessage from "../../classes/system/ResponseMessage"

import IsUndNull from "../../functions/logic/IsUndNull"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"

const ACTION = "Middleware de Requeridor Sistema"

/** Middleware para o parse e gravação da autenticação do requeridor sistema. */
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
            ResponseMessage.UnauthorizedSystem({
                expressResponse: res,
                log: ACTION
            })
        }

        const token = ParseJwt(authorization!)

        const systemKey = DecodeJwt({
            res: res,
            token: token
        })

        PrintAuthInReq({
            req: req,
            systemKey: systemKey
        })

        next()
    }
    catch (ex)
    {
        ResponseMessage.Send({
            status: HttpStatusEnum.INTERNAL_SERVER_ERROR,
            data: (ex as Error).message,
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

type DecodeJwtProps = {
    token : string
    res : Response
}

/**
 * Extrai os dados de autenticação do JWT.
 */
function DecodeJwt(props : DecodeJwtProps) : string
{
    const { res, token } = props

    const decoded = verify(
        token,
        Env.JwtSecret()
    ) as any

    const systemKey = decoded["SystemKey"] as string

    if (IsUndNull(systemKey)) {
        ResponseMessage.NoAuthFoundInToken({
            expressResponse: res,
            log: ACTION
        })
    }

    return systemKey
}

type PrintAuthInReqProps = {
    req : Request,
    systemKey : string
}

/**
 * Grava o valor das credenciais na requisição.
 */
function PrintAuthInReq(props : PrintAuthInReqProps)
{
    const { req, systemKey } = props

    if (req.method == "GET")
        req.query["SystemKey"] = systemKey
    else
        req.body["SystemKey"] = systemKey
}
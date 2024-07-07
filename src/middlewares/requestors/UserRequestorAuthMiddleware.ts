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

const ACTION = "Middleware de Requeridor Usuário"

/** Middleware para o parse e gravação da autenticação do requeridor usuário. */
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
            ResponseMessage.UnauthorizedUser({
                expressResponse: res,
                log: ACTION
            })
        }

        const token = ParseJwt(authorization!)

        const {
            userAuthId,
        } = DecodeJwt({
            res: res,
            token: token
        })

        PrintAuthInReq({
            req: req,
            userId: userAuthId
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
function DecodeJwt(props : DecodeJwtProps)
{
    const { res, token } = props

    const decoded = verify(
        token,
        Env.JwtSecret()
    ) as any

    const userAuthId = decoded["UserAuthId"] as string

    if (IsUndNull(userAuthId)) {
        ResponseMessage.NoAuthFoundInToken({
            expressResponse: res,
            log: ACTION
        })
    }

    return {
        userAuthId,
    }
}

type PrintAuthInReqProps = {
    req : Request,
    userId : string,
}

/**
 * Grava o valor das credenciais na requisição.
 */
function PrintAuthInReq(props : PrintAuthInReqProps)
{
    const { req, userId } = props

    if (req.method == "GET")
        req.query["UserAuthId"] = userId
    else
        req.body["UserAuthId"] = userId
}
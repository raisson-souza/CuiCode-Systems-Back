import {
    NextFunction,
    Request,
    Response,
} from "express"
import { verify } from "jsonwebtoken"
import Env from "../../config/Env"

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
            await ResponseMessage.UnauthorizedUser({
                expressResponse: res,
                responseLog: ACTION
            })
        }

        const token = ParseJwt(authorization!)

        const userAuthId = await DecodeJwt({
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

type DecodeJwtProps = {
    token : string
    res : Response
}

/**
 * Extrai os dados de autenticação do JWT.
 */
async function DecodeJwt(props : DecodeJwtProps) : Promise<string>
{
    try
    {
        const { res, token } = props
    
        const decoded = verify(
            token,
            Env.JwtSecret()
        ) as any
    
        const userAuthId = decoded["UserAuthId"] as string
    
        if (IsUndNull(userAuthId)) {
            await ResponseMessage.NoAuthFoundInToken({
                expressResponse: res,
                responseLog: ACTION
            })
        }
    
        return userAuthId
    }
    catch (ex)
    {
        switch ((ex as Error).message) {
            case "jwt malformed":
                await ResponseMessage.Send({
                    responseData: "Autenticação JWT mal formatada.",
                    responseLog: ACTION,
                    responseStatus: HttpStatusEnum.INVALID,
                    expressResponse: props.res
                })
                break
            case "jwt expired":
                await ResponseMessage.Send({
                    responseData: "Autenticação JWT expirada.",
                    responseLog: ACTION,
                    responseStatus: HttpStatusEnum.UNAUTHORIZED,
                    expressResponse: props.res
                })
                break
            default:
                break;
        }
        throw new Error((ex as Error).message)
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
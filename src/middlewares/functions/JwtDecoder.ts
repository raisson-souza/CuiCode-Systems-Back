import { Response } from "express"
import { verify } from "jsonwebtoken"
import Env from "../../config/Env"

import ResponseMessage from "../../classes/system/ResponseMessage"

import IsUndNull from "../../functions/logic/IsUndNull"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"

type JwtDecoderProps = {
    token : string
    res : Response
    action : string
    /** Chave a ser extraida do payload do JWT */
    tokenKey : string
}

/**
 * Extrai os dados de autenticação do token JWT.
 */
export default async function JwtDecoder(props : JwtDecoderProps) : Promise<string>
{
    try
    {
        const { res, token, action, tokenKey } = props

        const decoded = verify(
            token,
            Env.JwtSecret()
        ) as any

        const reqToken = decoded[tokenKey] as string

        if (IsUndNull(reqToken)) {
            await ResponseMessage.NoAuthFoundInToken({
                expressResponse: res,
                responseLog: action
            })
        }

        return reqToken
    }
    catch (ex)
    {
        const { action } = props
        switch ((ex as Error).message) {
            case "jwt malformed":
                await ResponseMessage.Send({
                    responseData: "Autenticação JWT mal formatada.",
                    responseLog: action,
                    responseStatus: HttpStatusEnum.INVALID,
                    expressResponse: props.res
                })
                break
            case "jwt expired":
                await ResponseMessage.Send({
                    responseData: "Autenticação JWT expirada.",
                    responseLog: action,
                    responseStatus: HttpStatusEnum.UNAUTHORIZED,
                    expressResponse: props.res
                })
                break
            default:
                break
        }
        throw new Error((ex as Error).message)
    }
}
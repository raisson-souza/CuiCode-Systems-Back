import DB from "../../classes/db/DB"
import UserAuth from "../../classes/entities/user/UserAuth"
import { Request, Response } from "express"
import PermissionLevelEnum from "../../enums/PermissionLevelEnum"

export default interface IAppService
{
    REQ : Request
    RES : Response
    Db : DB
    SameUserOperation : boolean

    UserAuth : UserAuth | null

    /** Titulo do log referente a AppService */
    readonly AppServiceAction : string

    /** Autentica o usuário requeridor validando seu status e existência */
    AuthenticateUserRequestor() : Promise<void>

    /** Autentica o sistema validando suas credenciais */
    AuthenticateSystemRequestor() : void

    /** Autentica o requeridor. Caso usuário valida o nível, caso sistema, passa.  */
    ValidateUserRequestor(validateUserRequestorProps : ValidateUserRequestorProps) : void

    /** Captura um valor específico da Query da requisição */
    GetReqQueryValue(key : string) : string | null

    /** Captura um valor específico do Body da requisição */
    GetReqBodyValue(key : string) : string | null

    /** Captura um valor específico do Param da requisição */
    GetReqParamValue(key : string) : string | null

    /** Captura os valores do JWT parseados no middleware de autenticação */
    GetJwtValues() : {
        SystemKey : string | null,
        UserAuthId : string | null
    }
}

type ValidateUserRequestorProps = {
    level? : PermissionLevelEnum
    userIdToOperate? : number
    allowDifferentUserAuthAndUserToOperate? : boolean
}

export type { ValidateUserRequestorProps }
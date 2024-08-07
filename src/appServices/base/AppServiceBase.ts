import { Request, Response } from "express"
import Env from "../../config/Env"

import DB from "../../classes/db/DB"
import ResponseMessage from "../../classes/system/ResponseMessage"
import UserAuth from "../../classes/entities/user/UserAuth"
import UsersService from "../../services/users/UsersService"
import UsersValidator from "../../validators/UsersValidator"

import IAppService, { ValidateUserRequestorProps } from "./IAppServiceBase"

import EncryptInfo from "../../functions/security/EncryptPassword"
import IsNil from "../../functions/logic/IsNil"
import PermissionLevelToNumber from "../../functions/enums/PermissionLevelToNumber"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"
import PermissionLevelEnum from "../../enums/PermissionLevelEnum"

export default abstract class AppServiceBase implements IAppService
{
    REQ : Request
    RES : Response
    Db : DB
    UserAuth : UserAuth | null
    AppServiceAction : string
    SameUserOperation : boolean

    constructor
    (
        req : Request,
        res : Response
    )
    {
        this.REQ = req
        this.RES = res
        this.Db = new DB()
    }

    async AuthenticateUserRequestor()
    {
        const userAuthId = Number.parseInt(this.GetJwtValues().UserAuthId ?? "")

        if (IsNil(userAuthId))
        {
            await ResponseMessage.Send({
                responseStatus: HttpStatusEnum.NOT_FOUND,
                responseData: "Usuário requeridor não encontrado.",
                responseLog: this.AppServiceAction,
                expressResponse: this.RES
            })
        }

        const user = await UsersService.Get({
            Db: this.Db,
            userId: userAuthId
        })
        .then(user => { return new UserAuth(user, this.REQ.headers)})
        .catch(async (ex) => {
            if (ex.message === "Nenhum usuário encontrado.")
            {
                await ResponseMessage.Send({
                    responseStatus: HttpStatusEnum.NOT_FOUND,
                    responseData: "Usuário requeridor não encontrado.",
                    responseLog: this.AppServiceAction,
                    expressResponse: this.RES
                })
            }

            throw new Error(ex.message)
        })

        UsersValidator.ValidateUserValidity(user)

        this.UserAuth = user
    }

    async AuthenticateSystemRequestor()
    {
        const key = this.GetJwtValues().SystemKey

        const encryptedKey = EncryptInfo(key)

        if (encryptedKey != EncryptInfo(Env.SystemJwtSecret())) {
            await ResponseMessage.UnauthorizedSystem({
                expressResponse: this.RES,
                responseLog: this.AppServiceAction
            })
        }

        this.UserAuth = null
    }

    async ValidateUserRequestor({
        userIdToOperate,
        level = PermissionLevelEnum.Member,
        allowDifferentUserAuthAndUserToOperate = false
    } : ValidateUserRequestorProps)
    {
        UsersValidator.ValidateUserPermission(this.UserAuth!, level)

        if (!IsNil(userIdToOperate))
        {
            if (this.UserAuth!.Id != userIdToOperate)
            {
                this.SameUserOperation = false
                if
                (
                    allowDifferentUserAuthAndUserToOperate ||
                    this.UserAuth!.PermissionLevel!.Value! >= PermissionLevelToNumber(PermissionLevelEnum.Adm)
                )
                    return
                    await ResponseMessage.ProhibitedOperation({
                    expressResponse: this.RES,
                    responseLog: this.AppServiceAction
                })
            }
            this.SameUserOperation = true
        }
    }

    GetReqBodyValue(key : string): string | null {
        const value = this.REQ.body[key]

        return !IsNil(value) ? value : null
    }

    GetReqParamValue(key : string): string | null {
        const value = this.REQ.params[key]

        return !IsNil(value) ? value : null
    }

    GetJwtValues() : { SystemKey : string | null, UserAuthId : string | null }
    {
        return this.REQ.method === "GET"
            ? {
                SystemKey: !IsNil(this.REQ.query["SystemKey"])
                    ? String(this.REQ.query["SystemKey"])
                    : null,
                UserAuthId: !IsNil(this.REQ.query["UserAuthId"])
                    ? String(this.REQ.query["UserAuthId"])
                    : null,
            }
            : {
                SystemKey: !IsNil(this.REQ.body["SystemKey"])
                    ? String(this.REQ.body["SystemKey"])
                    : null,
                UserAuthId: !IsNil(this.REQ.body["UserAuthId"])
                    ? String(this.REQ.body["UserAuthId"])
                    : null,
            }
    }
}
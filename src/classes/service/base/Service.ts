import { Client } from "pg"
import { Request, Response } from "express"

import CONFIG from "../../../config/database_config.json"

import ResponseMessage from "../../DTOs/ResponseMessage"
import UserAuth from "../../entities/user/UserAuth"

import IService from "../../../interfaces/IService"

import IsUndNull from "../../../functions/IsUndNull"

import HttpStatusEnum from "../../../enums/system/HttpStatusEnum"

/**
 * Contains all necessary params for all endpoints
 */
abstract class Service implements IService
{
    REQ : Request
    RES : Response
    DB_connection : Client
    USER_auth : UserAuth | null
    Action : string

    constructor
    (
        req : Request,
        res : Response
    )
    {
        this.REQ = req
        this.RES = res
        this.DB_connection = new Client(CONFIG.DatabaseConfig)
        this.PerformConnection()
    }

    abstract CheckBody() : any
    
    abstract CheckQuery() : any
    
    abstract Operation() : void

    abstract AuthenticateRequestor() : void

    abstract ValidateRequestor() : void

    private async PerformConnection()
    {
        await this.DB_connection.connect()
            .then(() => {})
            .catch(ex => {
                ResponseMessage.Send(
                    HttpStatusEnum.INTERNAL_SERVER_ERROR,
                    `Houve um erro ao conectar no banco. Erro: ${ ex.message }`,
                    this.Action,
                    this.RES
                )
            })
    }

    GetAuthentications() : { SystemKey : string | null, UserAuthId : string | null }
    {
        return this.REQ.method === "GET"
            ? {
                SystemKey: !IsUndNull(this.REQ.query["SystemKey"])
                    ? String(this.REQ.query["SystemKey"])
                    : null,
                UserAuthId: !IsUndNull(this.REQ.query["UserAuthId"])
                    ? String(this.REQ.query["UserAuthId"])
                    : null,
            }
            : {
                SystemKey: !IsUndNull(this.REQ.body["SystemKey"])
                    ? String(this.REQ.body["SystemKey"])
                    : null,
                UserAuthId: !IsUndNull(this.REQ.body["UserAuthId"])
                    ? String(this.REQ.body["UserAuthId"])
                    : null,
            }
    }

    GetReqValue
    (
        reqKey : string,
        errorMsg : string = "",
        throwError : boolean = false,
    )
    : string | null
    {
        if (this.REQ.method === "GET")
        {
            const reqValue = this.REQ.query[reqKey]

            if (IsUndNull(reqValue) && throwError)
                throw new Error(errorMsg)

            return !IsUndNull(reqValue) ? String(reqValue) : null
        }

        const reqValue = this.REQ.body[reqKey]

        if (IsUndNull(reqValue) && throwError)
            throw new Error(errorMsg)

        return !IsUndNull(reqValue) ? String(reqValue) : null
    }
}

export default Service
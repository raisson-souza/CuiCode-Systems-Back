import { Client } from "pg"
import { Request, Response } from "express"

import CONFIG from "../../../config/database_config.json"

import UserAuth from "../../UserAuth"

import IService from "../../../interfaces/IService"

import Send from "../../../functions/system/Send"

import PermissionLevelEnum from "../../../enums/PermissionLevelEnum"

/**
 * Contains all necessary params for all endpoints
 */
abstract class Service implements IService
{
    REQ : Request
    RES : Response
    DB_connection : Client
    USER_auth : UserAuth | null
    Action : string = ""

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

    abstract CheckBody(_ : any) : any

    abstract CheckQuery(_ : any) : any

    abstract Operation() : void

    abstract AuthenticateRequestor(_ : PermissionLevelEnum, __ : number) : void

    private async PerformConnection()
    {
        await this.DB_connection.connect()
            .then(() => {})
            .catch(ex => {
                Send.Error(this.RES, `Houve um erro ao conectar no banco. Erro: ${ ex.message }`, "Conexão no banco")
                throw new Error()
            })
    }
}

export default Service
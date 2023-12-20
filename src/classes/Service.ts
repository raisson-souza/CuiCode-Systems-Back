import { Client } from "pg"
import { Request, Response } from "express"

import CONFIG from "../config/database_config.json"

import QueryUser from "../services/user/utilities/QueryUser"

import User from "./User"

import IService from "../interfaces/IService"

import IsUndNull from "../functions/IsUndNull"
import Send from "../functions/system/Send"

import PermissionLevel from "../enums/PermissionLevelEnum"

/**
 * Contains all necessary params for all endpoints
 * @param REQ Request
 * @param RES Response
 * @param DB_connection Database connection
 * @param USER_req User Requester
 */
abstract class Service implements IService
{
    REQ : Request
    RES : Response
    DB_connection : Client
    // Necessário chamar SetReqUserAsync() na service requerida.
    // Caso UserReqId não exista, estoura erro.
    USER_req : User | null
    Action : string = ""

    constructor
    (
        req : Request,
        res : Response,
    )
    {
        this.REQ = req
        this.RES = res
        this.DB_connection = new Client(CONFIG.DatabaseConfig)
        this.PerformConnection()
    }

    Operation()
    {
        throw new Error("Method not implemented.")
    }

    CheckBody(_ : any)
    {
        throw new Error("Method not implemented.")
    }

    CheckQuery(_ : any)
    {
        throw new Error("Method not implemented.")
    }


    /**
     * Queries all UserReq info
     */
    async SetReqUserAsync()
    {
        const userReqId = this.CheckUserIdExistance()

        if (IsUndNull(userReqId))
            throw new Error("Usuário requeridor não encontrado na requisição.")

        const user = await Promise.resolve(
            QueryUser(this.DB_connection, userReqId))
                .then(user => {
                    return user
                })
                .catch(ex => {
                    throw new Error(ex.message)
                })

        this.USER_req = user
    }

    private CheckUserIdExistance() : number | null
    {
        const userIdInBody  = this.CheckUserReqInBody()
        if (!IsUndNull(userIdInBody))
            return userIdInBody

        const userIdInQuery = this.CheckUserReqInQuery()
        if (!IsUndNull(userIdInQuery))
            return userIdInQuery

        return null
    }

    /**
     * Checks and convert UserReq of query
     */
    private CheckUserReqInQuery() : number | null
    {
        const userReqQuery = this.REQ.query.UserReqId

        if (IsUndNull(userReqQuery))
            return null

        const userReqId = Number.parseInt(userReqQuery as string)

        return userReqId
    }

    /**
     * Checks and convert UserReq of body
     */
    private CheckUserReqInBody() : number | null
    {
        const userReqId = this.REQ.body.UserReqId

        if (IsUndNull(userReqId))
            return null

        return userReqId
    }

    private async PerformConnection()
    {
        await this.DB_connection.connect()
            .then(() => {})
            .catch(ex => {
                Send.Error(this.RES, `Houve um erro ao conectar no banco. Erro: ${ ex.message }`, "Conexão no banco")
                throw new Error()
            })
    }

    /**
     * @returns User level
     */
    GetReqUserLevel()
    {
        return !IsUndNull(this.USER_req)
            ? PermissionLevel[this.USER_req?.PermissionLevel?.Value!]
            : null
    }

    /**
     * @returns User Id, Username, Level and Name
     */
    GetReqUserBasicInfo()
    {
        return !IsUndNull(this.USER_req)
            ? {
                Id: this.USER_req?.Id,
                Username: this.USER_req?.Username,
                PermissionLevel: this.USER_req?.PermissionLevel?.Value,
                Name: this.USER_req?.Name
            }
            : null
    }
}

export default Service
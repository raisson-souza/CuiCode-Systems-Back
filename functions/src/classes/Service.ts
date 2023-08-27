import {
    Request,
    Response,
} from "firebase-functions"
import { Client } from "pg"

import User from "./User"

import QueryUser from "../services/user/utilities/QueryUser"

import DatabaseStage from "../enums/DatabaseStage"
import PermissionLevel from "../enums/PermissionLevel"

import IsUndNull from "../functions/IsUndNull"
import Send from "../functions/Responses"

import DATABASE from "../config/DATABASE.json"

/**
 * Contains all necessary params for all endpoints
 * @param REQ Request
 * @param RES Response
 * @param DB_stage Database reference
 * @param DB_connection Database connection
 * @param USER_req User Requester
 */
export default class Service
{
    REQ : Request
    RES : Response
    DB_stage : string
    DB_connection : Client
    // Necessário chamar SetReqUserAsync() na service requerida.
    // Caso UserReqId não exista, estoura erro.
    USER_req : User | null

    constructor
    (
        req : Request,
        res : Response,
        db_stage : DatabaseStage,
    )
    {
        this.REQ = req
        this.RES = res
        this.DB_stage = DatabaseStage[db_stage]
        this.DB_connection = new Client(DATABASE.DatabaseConfig)
        this.PerformConnection()
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
            QueryUser(this.DB_connection, this.DB_stage, userReqId))
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
        // VALIDAR ERRO EM CASO DE BANCO DESCONECTADO
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

import { Client } from "pg"
import { Request, Response } from "express"

import CONFIG from "../config/database_config.json"

import QueryUser from "../services/user/utilities/QueryUser"

import UserAuth from "./UserAuth"

import IService from "../interfaces/IService"

import IsUndNull from "../functions/IsUndNull"
import Send from "../functions/system/Send"

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
    // Ao necessitar de informações do usuário requeridor, o ID do mesmo estará no JWT.
    // Portanto, necessitando do usuário requeridor, necessita login.
    USER_auth : UserAuth | null
    Action : string = ""

    constructor
    (
        req : Request,
        res : Response,
        find_user_auth : boolean = false
    )
    {
        this.REQ = req
        this.RES = res
        this.DB_connection = new Client(CONFIG.DatabaseConfig)
        this.PerformConnection()

        if (find_user_auth)
            this.SetUserAuthAsync()
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
     * Queries all UserAuth info
     */
    async SetUserAuthAsync()
    {
        const userAuthId = this.CheckUserAuthIdExistance()

        if (IsUndNull(userAuthId))
            throw new Error("Usuário requeridor não encontrado na requisição.")

        const user = await Promise.resolve(
            QueryUser(this.DB_connection, userAuthId))
                .then(user => {
                    const auth = this.REQ.headers["authorization"]

                    if (IsUndNull(auth))
                        return user as UserAuth

                    const token = auth?.split(" ")[1]!

                    return UserAuth.NewUserAuth(user, token)
                })
                .catch(ex => {
                    throw new Error(ex.message)
                })

        this.USER_auth = user
    }

    private CheckUserAuthIdExistance() : number | null
    {
        const userIdInBody  = this.REQ.body.UserAuthId
        if (!IsUndNull(userIdInBody))
            return userIdInBody

        const userIdInQuery = Number.parseInt(this.REQ.query.UserAuthId as string)
        if (!IsUndNull(userIdInQuery))
            return userIdInQuery

        return null
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
}

export default Service
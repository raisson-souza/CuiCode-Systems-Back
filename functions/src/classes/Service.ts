import {
    Request,
    Response,
} from "firebase-functions"
import { Client } from "pg"

import User from "./User"

import QueryUser from "../services/user/utilities/QueryUser"

import IsUndNull from "../functions/IsUndNull"
import PermissionLevel from "../enums/PermissionLevel"
import DatabaseStage from "../enums/DatabaseStage"

import DATABASE from "../config/DATABASE.json"

/**
 * Contains all necessary params for all endpoints
 * @param REQ Request
 * @param RES Response
 * @param DB_stage Database reference
 * @param USER_req User Requester
 */
export default class Service
{
    REQ : Request
    RES : Response
    DB_stage : string
    DB_connection : Client
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
        this.DB_stage = `cui_code_systems_${ DatabaseStage[db_stage] }`
        this.DB_connection = new Client(DATABASE.DatabaseConfig)
        this.SetReqUserAsync()
    }

    /**
     * Queries all UserReq info
     */
    private async SetReqUserAsync()
    {
        const userReqId = this.CheckUserIdExistance()

        return Promise.resolve(
            QueryUser(this.DB_connection, this.DB_stage, userReqId))
                .then((user) => { this.USER_req = user })
                .catch(() => { this.USER_req = null })
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
        const userReqQuery = this.REQ.query.userReq

        if (IsUndNull(userReqQuery))
            return null

        const userReqJson = JSON.parse(userReqQuery as string)

        const userReqId = new Array(userReqJson)

        return userReqId[0]
    }

    /**
     * Checks and convert UserReq of body
     */
    private CheckUserReqInBody() : number | null
    {
        const userReqId = this.REQ.body.userReq

        if (IsUndNull(userReqId))
            return null

        return userReqId
    }

    /**
     * @returns User level
     */
    GetReqUserLevel()
    {
        return !IsUndNull(this.USER_req)
            ? PermissionLevel[this.USER_req?.Level?.Value!]
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
                Level: this.USER_req?.Level?.Value,
                Name: this.USER_req?.Name
            }
            : null
    }
}

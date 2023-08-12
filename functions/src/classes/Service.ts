import {
    Request,
    Response,
} from "firebase-functions"

import User from "./User"

import QueryUser from "../services/user/utilities/QueryUser"

import IsUndNull from "../functions/IsUndNull"
import PermissionLevel from "../enums/PermissionLevel"

/**
 * Contains all necessary params for all endpoints
 * @param REQ Request
 * @param RES Response
 * @param DB_ref Database reference
 * @param DB_stage Database stage
 * @param ADMIN Admin
 * @param USER_req User Requester
 * @param DB_users User database
 */
export default class Service
{
    REQ : Request
    RES : Response
    DB_ref : any
    DB_stage : string | null
    ADMIN : any | null
    DB_users : any | null
    // OPCIONAL / PÓS-INSTANCIAÇÃO
    USER_req : User | null

    /*  Params necessity for actions
        REQ       ALL
        RES       ALL
        DB_ref    ALL
        DB_stage  SET ACTIONS
        ADMIN     SET ACTIONS
        DB_users  ALL
        USER_req  ?
    */

    constructor
    (
        req : Request,
        res : Response,
        db_ref : any,
        db_stage : string | null = null,
        admin : any | null = null,
        db_users : any | null = null
    )
    {
        this.REQ = req
        this.RES = res
        this.DB_ref = db_ref
        this.DB_stage = db_stage
        this.ADMIN = admin
        this.DB_users = db_users
        this.GetReqUserAsync()
    }

    /**
     * Queries all UserReq info
     */
    private async GetReqUserAsync()
    {
        if (IsUndNull(this.DB_users))
            this.USER_req = null

        const userReqId = this.CheckUserIdExistance()

        await Promise.resolve(
            QueryUser(this.DB_users, userReqId))
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
        if (IsUndNull(this.USER_req))
            this.GetReqUserAsync()

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

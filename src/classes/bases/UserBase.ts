import { Client } from "pg"

import QueryUser from "../../services/user/utilities/QueryUser"

import { EntityLog } from "../entities/base/EntityLog"
import Base from "./base/Base"
import SqlLabel from "../entities/base/SqlLabel"
import User from "../entities/user/User"
import UserPhoto from "../entities/user/UserPhoto"

import AnySearch from "../../interfaces/AnySearch"

import IsUndNull from "../../functions/logic/IsUndNull"

abstract class UserBase extends Base
{
    static async Get
    (
        db : Client,
        id : number
    ) : Promise<User | null>
    {
        try
        {
            return await QueryUser(db, id)
        }
        catch
        {
            return null
        }
    }

    static async Update
    (
        db : Client,
        userId : number,
        log : EntityLog[],
        modifiedBy : number
    ) : Promise<User | null>
    {
        try
        {
            const query = `UPDATE users SET ${ EntityLog.BuildSqlQuery(log) }, modified = now(), modified_by = ${ modifiedBy } WHERE id = ${ userId }`
            await db.query(query)
            return UserBase.Get(db, userId)
        }
        catch
        {
            return null
        }
    }

    static async UpdateByModel
    (
        db : Client,
        model : User,
        modifiedBy : number
    ) : Promise<User | null>
    {
        try
        {
            let query = "UPDATE users SET "
            const formattedUserModel = model.ConvertToSqlObject() as AnySearch
            const formattedUserModelEntries = Object.entries(formattedUserModel)

            formattedUserModelEntries.forEach((prop, i) => {
                if (!IsUndNull(prop[1]))
                    query += `"${ prop[0] }" = ${ SqlLabel.ParsePropNameToSql(typeof prop[1], prop[1]) }${ i < formattedUserModelEntries.length - 1 ? ", " : "" }`
            })

            query += ` modified = now(), modified_by = ${ modifiedBy } WHERE id = ${ model.Id }`
            await db.query(query)

            return await UserBase.Get(db, model.Id)
        }
        catch (ex)
        {
            throw new Error((ex as Error).message)
        }
    }

    static async Create
    (
        _ : Client,
        __ : User
    ) { }

    static async GetPhoto
    (
        db : Client,
        userId : number
    )
    {
        const query = `SELECT * FROM users_photos WHERE user_id = ${ userId }`
        
        return await db.query(query)
            .then(result => {
                if (result.rowCount === 0)
                        return null
                    return new UserPhoto(result.rows[0])
                })
                .catch(ex => {
                    throw new Error(ex.message)
                })
    }

    static async CreateOrUpdatePhoto
    (
        db : Client,
        userId : number,
        photo : string
    )
    {
        const userPhotoRegistry = await UserBase.GetPhoto(db, userId)
        let query : string

        if (IsUndNull(userPhotoRegistry))
            query = `INSERT INTO users_photos (user_id, base_64) VALUES (${ userId }, '${ photo }')`
        else
            query = `UPDATE users_photos SET base_64 = '${ photo }', modified = now()  WHERE "user_id" = '${ userId }'`

        await db.query(query)

        return await UserBase.GetPhoto(db, userId)
    }

    static async GetByEmail
    (
        db : Client,
        email : string
    ) : Promise<User | null>
    {
        return await db.query(`SELECT * FROM users WHERE email = '${email}'`)
            .then(result => {
                if (result.rowCount === 0)
                    return null

                return new User(result.rows[0])
            })
    }
}

export default UserBase
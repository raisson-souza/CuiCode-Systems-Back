import { Client } from "pg"

import QueryUser from "../../services/user/utilities/QueryUser"

import { EntityLog } from "../DTOs/base/EntityLog"
import EntityBase from "./base/EntityBase"
import SqlLabel from "../DTOs/base/SqlLabel"
import User from "../entities/user/User"

abstract class UserBase extends EntityBase
{
    static async Get(db : Client, id : number) : Promise<User | null>
    {
        try
        {
            return QueryUser(db, id)
        }
        catch
        {
            return null
        }
    }

    static async Update(db : Client, userId : number, log : EntityLog[], modifierId : number) : Promise<User | null>
    {
        try
        {
            const query = `UPDATE users SET ${ EntityLog.BuildSqlQuery(log) }, modified = now(), modified_by = ${ modifierId } WHERE id = ${ userId }`
            await db.query(query)
            return UserBase.Get(db, userId)
        }
        catch
        {
            return null
        }
    }

    static async UpdateByModel(db : Client, model : User, modifierId : number) : Promise<User | null>
    {
        try
        {
            let query = "UPDATE users SET "
            const formattedUserModel = model.ConvertUserToSqlObject()
            const formattedUserModelEntries = Object.entries(formattedUserModel)

            formattedUserModelEntries.forEach((prop, i) => {
                query += `"${ prop[0] }" = ${ SqlLabel.ParsePropNameToSql(typeof prop[1], prop[1]) }${ i < formattedUserModelEntries.length - 1 ? ", " : "" }`
            })

            query += `, modified = now(), modified_by = ${ modifierId } WHERE id = ${ model.Id }`
            await db.query(query)
            return await UserBase.Get(db, model.Id)
        }
        catch
        {
            return null
        }
    }

    static async Create(db : Client, model : User) { }
}

export default UserBase
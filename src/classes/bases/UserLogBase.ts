import { Client } from "pg"

import { EntityLog } from "../entities/base/EntityLog"
import Log from "../entities/log/Log"

import FindValue from "../../functions/logic/FindValue"
import IsUndNull from "../../functions/logic/IsUndNull"

abstract class UserLogBase
{
    static async Create
    (
        db : Client,
        userId : number,
        modifiedBy : number,
        isAdmChange : boolean,
        userLog : EntityLog[]
    ) : Promise<Log | null>
    {
        let newLogId : number | null = null
        const createQuery = `INSERT INTO users_logs ("user_id", "change", "adm_change", "modified_by") VALUES (${ userId }, '${ EntityLog.ConvertJsonToString(userLog) }', '${ isAdmChange }', '${ modifiedBy }') RETURNING id`

        await db.query(createQuery)
            .then(result => {
                newLogId = FindValue(result.rows[0], ["id"])
            })

        return !IsUndNull(newLogId)
            ? await db.query(`SELECT * FROM users_logs WHERE id = ${ newLogId }`)
                .then(result => {
                    return new Log(result.rows[0], "UserId", "user_id")
                })
            : null
    }
}

export default UserLogBase
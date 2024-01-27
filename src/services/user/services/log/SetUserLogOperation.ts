import { Client } from "pg"

import { EntityLog } from "../../../../classes/DTOs/EntityLog"
import Operation from "../../../../classes/Operation"
import User from "../../../../classes/User"

class SetUserLogOperation extends Operation
{
    UserLog : EntityLog[]
    AdmChange : boolean

    constructor
    (
        user : User | null,
        db_connection : Client,
        userLog : EntityLog[],
        admChange : boolean = false
    )
    {
        super(user, db_connection)
        this.UserLog = userLog
        this.AdmChange = admChange
    }

    async PerformOperation()
    {
        const query = `INSERT INTO users_logs ("user_id", "change", "adm_change") VALUES (${ this.User!.Id }, '${ EntityLog.ConvertJsonToString(this.UserLog) }', '${ this.AdmChange }')`

        await this.DB_connection.query(query)
            .then(() => {})
            .catch(ex => {
                throw new Error((ex as Error).message)
            })
    }
}

export default SetUserLogOperation
import { Client } from "pg"

import Base from "./base/Base"
import UserAccountRestoration from "../entities/user/UserAccountRestoration"

import IsUndNull from "../../functions/logic/IsUndNull"

abstract class UserAccountRestorationBase extends Base
{
    static async Get
    (
        db : Client,
        userAccountRestorationId : number
    )
    {
        const query = `SELECT * FROM user_account_restorations WHERE id = ${ userAccountRestorationId }`

        return await db.query(query)
            .then(result => {
                if (result.rowCount === 0)
                    return null

                return new UserAccountRestoration(result.rows[0])
            })
    }

    static async Create
    (
        db : Client,
        userAccountRestoration : UserAccountRestoration
    )
    {
        let query = 'INSERT INTO user_account_restorations ("jwt", "user_id", "user_email") VALUES '

        if (IsUndNull(userAccountRestoration.Jwt))
            userAccountRestoration.CreateJwt()

        query += `('${ userAccountRestoration.Jwt }', ${ userAccountRestoration.UserId }, '${ userAccountRestoration.UserEmail }') RETURNING id`

        return await db.query(query)
            .then(async (result) => {
                if (result.rowCount === 0)
                    return null

                return await UserAccountRestorationBase.Get(db, result.rows[0]["id"])
            })
    }

    static async Complete
    (
        db : Client,
        userAccountRestorationId : number
    )
    {
        const query = `UPDATE user_account_restorations SET "completed" = true WHERE "id" = ${ userAccountRestorationId }`

        await db.query(query)
    }

    static async Expire
    (
        db : Client,
        userAccountRestorationId : number
    )
    {
        const query = `UPDATE user_account_restorations SET "expired" = true, "completed" = true WHERE "id" = ${ userAccountRestorationId }`

        await db.query(query)
            .catch(ex => {
                console.log(ex)
            })
    }
}

export default UserAccountRestorationBase
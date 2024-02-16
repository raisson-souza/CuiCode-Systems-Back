import { Client } from "pg"

import UserAccountRestoration from "../classes/entities/user/UserAccountRestoration"

import IsJwtExpired from "../functions/math/IsTimeExpired"

abstract class UserAccountRestorationRepository
{
    static async ValidateCreation
    (
        db : Client,
        userId : number
    ) : Promise<boolean>
    {
        const userAccountRestorationList : UserAccountRestoration[] = []

        const query = `SELECT * FROM user_account_restorations WHERE "user_id" = ${ userId } AND "completed" = false`
        await db.query(query)
            .then(result => {
                if (result.rowCount === 0) 
                    return

                result.rows.forEach(userAccountRestoration => {
                    userAccountRestorationList.push(new UserAccountRestoration(userAccountRestoration))
                })
            })

        const userAccountRestorationListToExpire : number[] = []

        userAccountRestorationList.forEach(userAccountRestoration => {
            let isExpired = false

            try 
            {
                isExpired = IsJwtExpired(userAccountRestoration.Jwt!)
            } catch
            {
                isExpired = true
            }

            if (isExpired)
            {
                userAccountRestorationListToExpire.push(userAccountRestoration.Id)
                userAccountRestoration.Expired = true
                userAccountRestoration.Completed = true
            }
        })

        if (userAccountRestorationListToExpire.length > 0)
            await this.MassExpirationProcess(db, userAccountRestorationListToExpire)

        if (userAccountRestorationListToExpire.length < userAccountRestorationList.length)
            return false

        return true
    }

    private static async MassExpirationProcess
    (
        db : Client,
        userAccountRestorationListToExpire : number[]
    )
    {
        let query = `UPDATE user_account_restorations SET "expired" = true, "completed" = true WHERE "id" in (`

        const len = userAccountRestorationListToExpire.length - 1

        userAccountRestorationListToExpire.forEach((num, i) => {
            query += `${ num }${ i === len ? ")" : ", "}`
        })

        await db.query(query)
            .catch(ex => {
                console.log(ex)
            })
    }
}

export default UserAccountRestorationRepository
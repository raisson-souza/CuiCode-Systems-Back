import UserAccountRestoration from "../../classes/entities/user/UserAccountRestoration"

import {
    CompleteProps,
    CreateProps,
    ExpireProps,
    GetByJwtProps,
    GetByUserIdProps
} from "./types/UsersAccountRecoveryServiceProps"

export default abstract class UsersAccountRecoveryService
{
    static async GetByJwt(props : GetByJwtProps) : Promise<UserAccountRestoration[]>
    {
        const query = `SELECT * FROM user_account_restorations WHERE jwt = '${ props.jwt }' ORDER BY id LIMIT 20`

        return props.Db.PostgresDb.query(query)
            .then(result => {
                const usersAccountRestorations : UserAccountRestoration[] = []

                result.rows.map(row => {
                    usersAccountRestorations.push(new UserAccountRestoration(row))
                })

                return usersAccountRestorations
            })
            .catch(ex => { throw new Error(ex.message) })
    }

    static async GetByUserId(props : GetByUserIdProps) : Promise<UserAccountRestoration[]>
    {
        const query = `SELECT * FROM user_account_restorations WHERE user_id = '${ props.userId }' ORDER BY id LIMIT 20`

        return props.Db.PostgresDb.query(query)
            .then(result => {
                const usersAccountRestorations : UserAccountRestoration[] = []

                result.rows.map(row => {
                    usersAccountRestorations.push(new UserAccountRestoration(row))
                })

                return usersAccountRestorations
            })
            .catch(ex => { throw new Error(ex.message) })
    }

    static async Create(props : CreateProps) : Promise<UserAccountRestoration>
    {
        const userAccountRestoration = new UserAccountRestoration({
            user_id: props.userId,
            user_email: props.email
        })

        userAccountRestoration.CreateJwt()

        const {
            Jwt,
            UserId,
            UserEmail
        } = userAccountRestoration

        const query = `INSERT INTO user_account_restorations ("jwt", "user_id", "user_email") VALUES ('${ Jwt }', ${ UserId }, '${ UserEmail }') RETURNING *`

        return await props.Db.PostgresDb.query(query)
            .then(result => {
                return new UserAccountRestoration(result.rows[0])
            })
            .catch(ex => { throw new Error(ex.message) })
    }

    static async Complete(props : CompleteProps) : Promise<void>
    {
        const query = `UPDATE user_account_restorations SET completed = true WHERE id = ${ props.recoveryId }`

        await props.Db.PostgresDb.query(query)
            .then(() => {})
            .catch(ex => { throw new Error(ex.message) })
    }

    static async Expire(props : ExpireProps) : Promise<void>
    {
        const query = `UPDATE user_account_restorations SET expired = true, completed = true WHERE id = ${ props.recoveryId }`

        await props.Db.PostgresDb.query(query)
            .then(() => {})
            .catch(ex => { throw new Error(ex.message) })
    }

}
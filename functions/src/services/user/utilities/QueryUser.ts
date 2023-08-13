import { Client } from "pg";

import User from "../../../classes/User"

import IsUndNull from "../../../functions/IsUndNull"

/**
 * Queries information about a user.
 * @param db_connection 
 * @param db_stage 
 * @param userId 
 * @returns 
 */
export default async function QueryUser
(
    db_connection : Client,
    db_stage : string,
    userId : number | null,
)
: Promise<User>
{
    try
    {
        if (IsUndNull(userId))
            throw new Error("Id de usuário deve ser informado.");

        // testar sql injection
        const query = `SELECT * FROM ${ db_stage }.users where id = ${ userId }`;

        return db_connection.query(query)
            .then(result => {
                const user = new User(result.rows)
                return user
            })
            .catch(ex => {
                throw new Error(ex.message);
            })
    }
    catch (ex)
    {
        throw new Error((ex as Error).message);
    }
}

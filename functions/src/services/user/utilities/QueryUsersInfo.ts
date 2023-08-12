import { Client } from "pg"

/**
 * Queries specific information about all users.
 * @param db_connection 
 * @param db_stage
 * @param requiredInfo 
 * @returns 
 */
export default async function QueryUsersInfo
(
    db_connection : Client,
    db_stage : string,
    requiredInfo : Array<string>
)
: Promise<Array<object>>
{
    try
    {
        if (requiredInfo.length == 0)
            throw new Error("Nenhuma informação requerida.")

        let query = "SELECT"

        requiredInfo.forEach((info, i) => {
            if (i != requiredInfo.length - 1)
                query += ` ${ info },`
            else
                query += ` ${ info } `
        })

        query += ` FROM ${ db_stage }.users`

        return db_connection.connect()
            .then(async () => {
                return db_connection.query(query)
                    .then(result => {
                        return result.rows
                    })
                    .catch(ex => {
                        throw new Error(ex.message)
                    })
            })
            .catch(ex => {
                throw new Error(ex.message)
            })
    }
    catch (ex)
    {
        throw new Error((ex as Error).message);
    }
}

import { Client } from "pg"

/**
 * Queries specific information about all users.
 * @param db_connection
 * @param requiredInfo
 * @returns
 */
async function QueryUsersInfo
(
    db_connection : Client,
    requiredInfo : Array<string>
)
: Promise<Array<object> | null>
{
    try
    {
        if (requiredInfo.length == 0)
            throw new Error("Nenhuma informação requerida.")

        let query = "SELECT"

        requiredInfo.forEach((info, i) => {
            if (i != requiredInfo.length - 1)
                query += ` "${ info }",`
            else
                query += ` "${ info }" `
        })

        query += `FROM users`

        return await db_connection.query(query)
            .then(result => {
                if (result.rowCount == 0)
                    return null

                return result.rows
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

export default QueryUsersInfo
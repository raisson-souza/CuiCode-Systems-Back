import { Client } from "pg"

import User from "../../../classes/entities/user/User"

import IsUndNull from "../../../functions/logic/IsUndNull"

/**
 * Queries information about a user.
 */
async function QueryUser
(
    db_connection : Client,
    userId : number | null,
    nonPrivateQuery : boolean = false
)
: Promise<User>
{
    try
    {
        if (IsUndNull(userId))
            throw new Error("Id de usuário deve ser informado.")

        const query = BuildQuery(nonPrivateQuery, userId!)

        return await db_connection.query(query)
            .then(result => {
                // EM CASO DE BUSCA DE USUÁRIO REQUERIDOR, RETORNAR ERRO DIFERENTE
                if (result.rowCount == 0)
                    throw new Error("Nenhum usuário encontrado.")

                const user = new User(result.rows[0])
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

function BuildQuery(nonPrivateQuery : boolean, userId : number)
{
    return !nonPrivateQuery
        ? `SELECT * FROM users WHERE id = ${ userId }`
        : `SELECT id, username, birthdate, sex, photo_base_64, permission_level, created, active, deleted FROM users WHERE id = ${ userId }`
}

export default QueryUser
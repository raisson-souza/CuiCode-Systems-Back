import { Client } from "pg"

import User from "../../../classes/User"

import IsUndNull from "../../../functions/IsUndNull"

/**
 * Queries information about a user.
 * @param db_connection 
 * @param userId 
 * @returns 
 */
export default async function QueryUser
(
    db_connection : Client,
    userId : number | null,
)
: Promise<User>
{
    try
    {
        if (IsUndNull(userId))
            throw new Error("Id de usuário deve ser informado.");

        const query = `SELECT * FROM users WHERE id = ${ userId }`;

        return await db_connection.query(query)
            .then(result => {
                // EM CASO DE BUSCA DE USUÁRIO REQUERIDOR, RETORNAR ERRO DIFERENTE
                if (result.rowCount == 0)
                    throw new Error("Nenhum usuário encontrado.")

                const user = new User(result.rows[0], true)
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

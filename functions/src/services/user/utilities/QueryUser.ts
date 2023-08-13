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

            const query = `SELECT * FROM ${ db_stage }.users WHERE id = ${ userId }`;

        return db_connection.query(query)
            .then(result => {
                if (result.rowCount > 1)
                    throw new Error("Mais de um usuário foi encontrado na consulta indivídual.") // ERRO CRÍTICO

                if (result.rowCount == 0)
                    throw new Error("Nenhum usuário encontrado.")

                const user = new User(result.rows[0], true, true)
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

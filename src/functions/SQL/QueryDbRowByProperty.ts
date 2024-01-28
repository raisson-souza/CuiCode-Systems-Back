import { Client } from "pg"

import SqlLabel from "../../classes/DTOs/base/SqlLabel"

import IsUndNull from "../IsUndNull"

/**
 * Queries a user by a property.
 * @param db_connection 
 * @param dbTable Tabela do banco a ser realizada query
 * @param userSqlColumn Coluna a ser aplicado WHERE
 * @param userSqlColumnValue Valor da coluna a ser procurado na tabela
 * @param extractColumnName Valor da coluna na linha encontrada a ser extraido
 * @returns 
 */
async function QueryDbRowByProperty
(
    db_connection : Client,
    dbTable : string,
    userSqlColumn : string,
    userSqlColumnValue : any,
    extractColumnName : string | null = null // Caso nulo retorna toda a linha
)
: Promise<any>
{
    try
    {
        if (IsUndNull(userSqlColumn) || IsUndNull(userSqlColumnValue))
            throw new Error("Coluna ou valor devem ser informados.");

        const query =
        `
            SELECT *
            FROM ${ dbTable }
            WHERE
                ${ userSqlColumn } = ${ SqlLabel.ParsePropNameToSql(typeof userSqlColumnValue, userSqlColumnValue) }
        `

        return await db_connection.query(query)
            .then(result => {
                if (result.rowCount == 0)
                    throw new Error("Nenhum dado encontrado.")
                if (!IsUndNull(extractColumnName))
                    return result.rows[0][extractColumnName!]
                return result.rows[0]
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

export default QueryDbRowByProperty
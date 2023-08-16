import { Client } from "pg";

const { format } = require("date-fns")

import User from "../../../classes/User"

import IsUndNull from "../../../functions/IsUndNull";

import QueryUsersInfos from "./QueryUsersInfo";

/**
 * Creates a user.
 */
export default async function CreateUser
(
    db_connection : Client,
    db_stage : string,
    user : User,
)
: Promise<void>
{
    try
    {
        // criar func para envio de data ao db
        let query =
        `
            INSERT INTO ${ db_stage }.users (${ GenerateUserFields() }) VALUES 
            (
                '${ user.Username }',
                '${ user.Name }',
                to_date('${ new Date(user.BirthDate).toLocaleDateString() }', 'dd MM yyyy'),
                ${ user.Sex?.Value },
                '${ user.Email }',
                '${ user.RecoveryEmail }',
                '${ user.Phone }',
                '${ user.Password }',
                '${ user.PasswordHint }',
                ${ user.Level?.Value },
                to_date('${ new Date(user.CreatedDate).toLocaleDateString() }', 'dd MM yyyy'),
                ${ user.Active },
                ${ user.Deleted }
            )
        `

        await db_connection.query(query)
            .then(() => {})
            .catch(ex => {
                throw new Error(ex.message);
            })
    }
    catch (ex)
    {
        throw new Error((ex as Error).message);
    }
}

// USAR FUNÇÃO PARA APENAS RETORNAR A STRING JA FORMATADA
function GenerateUserFields() : string
{
    const userSQLFields = [
        "username",
        "name",
        "birthdate",
        "sex",
        "email",
        "recovery_email",
        "phone",
        "password",
        "password_hint",
        "permission_level",
        "created_date",
        "active",
        "deleted"
    ]

    let query = ""

    userSQLFields.forEach((field, i) => {
        if (i + 1 == userSQLFields.length)
            query += ` ${ field }`
        else
            query += `${ field }, `
    })

    return query
}
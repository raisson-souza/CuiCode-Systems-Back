import { Client } from "pg";

import User from "../../../classes/User"
import ToSqlDate from "../../../functions/SQL/ToSqlDate"
import ToSqlTimestamp from "../../../functions/SQL/ToSqlTimestamp"

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
        let query =
        `
            INSERT INTO ${ db_stage }.users (${ GenerateUserFields() }) VALUES 
            (
                '${ user.Username }',
                '${ user.Name }',
                ${ ToSqlDate(user.BirthDate) },
                '${ user.Email }',
                '${ user.RecoveryEmail }',
                '${ user.Phone }',
                '${ user.Password }',
                '${ user.PasswordHint }',
                '${ user.PhotoBase64 }',
                ${ user.PermissionLevel?.Value },
                ${ user.Sex?.Value },
                '${ user.EmailAproved }',
                ${ user.AcceptedBy },
                ${ user.Active },
                ${ ToSqlTimestamp(user.CreatedDate) },
                ${ user.Deleted }
            )
        `

        query.trim()

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
    return `
        "username",
        "name",
        "birthdate",
        "email",
        "recovery_email",
        "phone",
        "password",
        "password_hint",
        "photo_base_64",
        "permission_level",
        "sex",
        "email_approved",
        "accepted_by",
        "active",
        "created_date",
        "deleted"
    `
}
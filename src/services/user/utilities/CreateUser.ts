import { Client } from "pg"

import User from "../../../classes/User"

import ToSqlDate from "../../../functions/SQL/ToSqlDate"

import crypto from "crypto-js"

/**
 * Creates a user.
 */
async function CreateUser
(
    db_connection : Client,
    user : User,
)
: Promise<void>
{
    try
    {
        EncryptUserPassword(user)

        let query =
        `
            INSERT INTO users (${ GenerateUserFields() }) VALUES 
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
                ${ user.Sex?.Value }
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
        "sex"
    `
}

function EncryptUserPassword(user : User) : void
{
    user.Password = crypto.MD5(user.Password).toString()
}

export default CreateUser
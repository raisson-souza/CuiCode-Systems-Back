import { Client } from "pg"

import User from "../../../classes/User"

import PermissionLevel from "../../../enums/PermissionLevelEnum"

/**
 * Validates a user
 */
export default async function ValidateUser
(
    db_connection : Client,
    db_stage : string,
    user : User,
    // Validação completa em caso de criação de usuário
    isCreation : boolean = true
)
: Promise<void>
{
    try
    {
        const query = `SELECT * FROM ${ db_stage }.users`

        await db_connection.query(query)
            .then(result => {
                result.rows.forEach(userQuery => {
                    if (user.Id == userQuery["id"] && isCreation)
                        throw new Error(`Id ${ user.Id } já está em uso.`)

                    if (user.Username == userQuery["username"])
                        throw new Error(`Username ${ user.Username } já está em uso.`)

                    if (user.Email == userQuery["email"])
                        throw new Error(`Email ${ user.Email } já está em uso.`)

                    if (user.RecoveryEmail == userQuery["recovery_email"])
                        throw new Error(`Email de recuperação ${ user.RecoveryEmail } já está em uso.`)

                    if (user.Phone == userQuery["phone"])
                        throw new Error(`Telefone ${ user.Phone } já está em uso.`)

                    if (
                        userQuery["permission_level"] == PermissionLevel.Root &&
                        user.PermissionLevel?.Value == PermissionLevel.Root
                    )
                        throw new Error("Já existe um usuário com permissão ROOT.")
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

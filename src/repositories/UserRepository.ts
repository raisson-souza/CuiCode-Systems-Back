import { Client } from "pg"

import EntityRepository from "./EntityRepository"
import User from "../classes/entities/user/User"

import IsUndNull from "../functions/logic/IsUndNull"

import PermissionLevelEnum from "../enums/PermissionLevelEnum"

abstract class UserRepository
{
    /**
     * Realiza a validação do usuário a ser editado ou criado sobre os já existentes.
     */
    private static async ValidateUser
    (
        db : Client,
        user : User,
        isCreation : boolean = false
    )
    {
        function CreateUserComparisonQuery(user : User)
        {
            let query = ""
            let queryProps : string[] = []

            if (!IsUndNull(user.Username) || isCreation)
                queryProps.push(`username = '${ user.Username }'`)

            if (!IsUndNull(user.Email) || isCreation)
                queryProps.push(`email = '${ user.Email }'`)

            if (!IsUndNull(user.RecoveryEmail) || isCreation)
                queryProps.push(`recovery_email = '${ user.RecoveryEmail }'`)

            if (!IsUndNull(user.Phone) || isCreation)
                queryProps.push(`phone = '${ user.Phone }'`)

            queryProps.forEach((comparison, i) => {
                query += `${ comparison }${ i < queryProps.length - 1 ? ' OR ' : '' }`
            })

            return query
        }

        const userComparisonQuery = CreateUserComparisonQuery(user)

        if (userComparisonQuery === "")
            return

        const query =
        `
            SELECT
                *
            FROM
                users
            WHERE
                ${
                    !isCreation
                        ? `id != ${ user.Id } AND (${ userComparisonQuery })`
                        : userComparisonQuery
                }
        `

        await db.query(query)
            .then(result => {
                if (result.rowCount > 0)
                {
                    result.rows.forEach(userDb =>
                    {
                        if (userDb["username"] == user.Username)
                            throw new Error("Nome de usuário já utilizado.")

                        if (userDb["email"] == user.Email)
                            throw new Error("Email já utilizado.")

                        if (userDb["recovery_email"] == user.RecoveryEmail)
                            throw new Error("Email de recuperação já utilizado.")

                        if (userDb["phone"] == user.Phone)
                            throw new Error("Número de telefone já utilizado.")
                    })
                }
            })
            .catch(ex => {
                throw new Error(ex.message)
            })
    }

    /**
     * Valida as propriedades de um usuário a ser criado.
     */
    static async ValidateCreation(user : User, db : Client)
    {
        this.ValidateEntityNonViolableProps(user)

        this.ValidateEmptyness(user)

        this.ValidateUsername(user)

        await this.ValidateUser(db, user, true)

        if (user.Email.indexOf("@") == -1 || user.RecoveryEmail.indexOf("@") == -1)
            throw new Error("Email ou email de recuperação inválido.")

        if (user.Password.search(/^[0-9]+$/) != -1)
            throw new Error("A senha não pode conter apenas números.")

        if (user.Password.search(/\d+/g) == -1)
            throw new Error("A senha não pode conter apenas letras.")

        if (user.PasswordHint.includes(user.Password))
            throw new Error("A senha não pode estar presente na dica da senha.")

        user.Name.toLocaleLowerCase().split(" ").forEach(namePart => {
            if (user.Password.includes(namePart))
                throw new Error("A senha não pode conter partes do nome do usuário.")
        })
    }

    /**
     * Valida as propriedades de um usuário a ser editado.
     */
    static async ValidateUpdate(user : User, db : Client)
    {
        this.ValidateEntityNonViolableProps(user)

        await this.ValidateUser(db, user)

        if (!IsUndNull(user.Username))
            this.ValidateUsername(user)

        if (!IsUndNull(user.Email) && !IsUndNull(user.RecoveryEmail))
        {
            if (user.Email.indexOf("@") == -1 || user.RecoveryEmail.indexOf("@") == -1)
                throw new Error("Email ou email de recuperação inválido.")
        }

        if (!IsUndNull(user.Password))
        {
            if (user.Password.search(/\d+/g) == -1)
                throw new Error("A senha não pode conter apenas letras.")
        }

        // Não é possível validar se a dica de senha ou nome consta na senha por ela estar encriptografada.
    }

    private static ValidateUsername(user : User)
    {
        if (user.Username.length > 20)
            throw new Error("Username além do limite.")
        
        if (user.Username.charAt(0) != "@")
            throw new Error("Username inválido.")

        let newUsername = user.Username.replace("@", "").split("")

        if (newUsername.includes("@"))
            throw new Error("Username inválido.")

        const UnwantedCharacters = ["!", "?", "#", "$", "%", "¨", "&", "*", "(", ")", "-", "=", "+", "°", '"', "'", "´", "`", "[", "]", "{", "}", ",", ".", " "]

        UnwantedCharacters.forEach(character => {
            if (user.Username.includes(character))
                throw new Error("Username inválido.")
        })
    }

    private static ValidateEmptyness(user : User)
    {
        if (IsUndNull(user.Username))
            throw new Error("Username de usuário inexistente.")

        if (IsUndNull(user.Name))
            throw new Error("Nome de usuário inexistente.")

        if (IsUndNull(user.BirthDate))
            throw new Error("Data de aniversário de usuário inexistente.")

        if (IsUndNull(user.Email))
            throw new Error("Email de usuário inexistente.")

        if (IsUndNull(user.RecoveryEmail))
            throw new Error("Email de recuperação de usuário inexistente.")

        if (IsUndNull(user.Phone))
            throw new Error("Número de celular de usuário inexistente.")

        if (IsUndNull(user.Password))
            throw new Error("Senha de usuário inexistente.")

        if (IsUndNull(user.PasswordHint))
            throw new Error("Dica de senha de usuário inexistente.")

        if (IsUndNull(user.Sex))
            throw new Error("Sexo de usuário inexistente.")
    }

    private static ValidateEntityNonViolableProps(user : User)
    {
        EntityRepository.ValidateEntity(user)

        if (!IsUndNull(user.EmailAproved))
            throw new Error("Uma ou mais propriedades não podem ser editadas.")
    }

    static ValidateUserPermission(user : User, level : PermissionLevelEnum)
    {
        if (IsUndNull(user.PermissionLevel!.Value))
            throw new Error("Nível de permissão de usuário não encontrado.")

        if (user.PermissionLevel!.Value! < level)
            throw new Error("Ação não autorizada para o usuário.")
    }

    static ValidateUserValidity(user : User)
    {
        if (IsUndNull(user.Active) || IsUndNull(user.Deleted))
            throw new Error("Usuário inapto para tal ação.")

        if (!user.Active || user.Deleted)
            throw new Error("Usuário inapto para tal ação.")
    }

    static ValidateUserGroupCreationLimit(user : User) { }
}

export default UserRepository
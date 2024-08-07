import { Client } from "pg"

import EntityValidator from "./EntityValidator"
import User from "../classes/entities/user/User"

import IsUndNull from "../functions/logic/IsUndNull"

import PermissionLevelEnum from "../enums/PermissionLevelEnum"

import { UserUpdateValidatorProps } from "./types/UsersValidatorProps"

export default abstract class UsersValidator
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

        this.ValidateEmail(user.Email)

        this.ValidateEmail(user.RecoveryEmail)

        this.ValidatePassword(user.Password)

        this.ValidatePasswordHint(user.Password, user.PasswordHint)

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
            Promise.all([
                this.ValidateEmail(user.Email),
                this.ValidateEmail(user.RecoveryEmail)
            ])
            .catch(() => {
                throw new Error("Email ou email de recuperação inválido.")
            })
        }

        // if (!IsUndNull(user.Password))
        // {
        //     if (user.Password.search(/\d+/g) == -1)
        //         throw new Error("A senha não pode conter apenas letras.")
        // }

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
        EntityValidator.ValidateEntity(user)

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

    static ValidatePassword(password : string)
    {
        if (password.search(/^[0-9]+$/) != -1)
            throw new Error("A senha não pode conter apenas números.")

        if (password.search(/\d+/g) == -1)
            throw new Error("A senha não pode conter apenas letras.")
    }

    static ValidatePasswordHint(password: string, passwordHint: string)
    {
        if (passwordHint.includes(password))
            throw new Error("A senha não pode estar presente na dica da senha.")
    }

    static ValidateEmail(email: string)
    {
        if (email.indexOf("@") == -1)
            throw new Error("Email inválido.")
    }

    static ValidateUserGroupCreationLimit(user : User) { } // TODO: transformar em service!

    /**
     * Valida a edição de um usuário baseado na diferença entre o usuário do banco e o novo.
     * Necessita ser chamado antes da edição dos dados imutáveis.
    */
    static Update(updateProps : UserUpdateValidatorProps)
    {
        const {
            dbUser,
            newUser,
            userAuth,
            sameUserOperation
        } = updateProps

        if (!userAuth.IsAdm() && !sameUserOperation)
            throw new Error("Você não tem permissão para editar outro usuário.")

        if (userAuth.IsAdm() && dbUser.PermissionLevel!.Value === 4 && userAuth.PermissionLevel!.Value != 4)
            throw new Error("Você não tem permissão para editar um usuário administrador ROOT.")

        if (dbUser.Id != newUser.Id)
            throw new Error("Id de usuário não pode ser editado.")

        const authUserLevel = userAuth.PermissionLevel!.Value

        if (!sameUserOperation)
        {
            // Caso edição de nível
            if (dbUser.PermissionLevel!.Value != newUser.PermissionLevel!.Value)
            {
                // Caso upgrade de nível
                if (newUser.PermissionLevel!.Value > dbUser.PermissionLevel!.Value)
                {
                    switch (authUserLevel)
                    {
                        case 3:
                            // Caso authUser ADM tornando user GUEST
                            if (newUser.PermissionLevel!.Value === 1)
                                throw new Error("Você não pode tornar outro usuário um convidado.")
                            // Caso authUser ADM tornando user ADM
                            if (newUser.PermissionLevel!.Value === 3)
                                throw new Error("Você não pode tornar outro usuário um administrador.")
                            // Caso authUser ADM tornando user ROOT
                            else if (newUser.PermissionLevel!.Value === 4)
                                throw new Error("Você não pode tornar outro usuário um administrador ROOT.")
                            break
                        case 4:
                            // Caso authUser ROOT tornando user ROOT
                            if (newUser.PermissionLevel!.Value === 4)
                                throw new Error("Você não pode tornar outro usuário um administrador ROOT.")
                        default:
                    }
                }
                // Caso downgrade de nível
                else
                {
                    switch (authUserLevel)
                    {
                        case 3:
                            // Caso authUser ADM tornando user GUEST
                            if (newUser.PermissionLevel!.Value === 1)
                                throw new Error("Você não pode tornar outro usuário um convidado.")
                            // Caso authUser ADM tornando user MEMBER
                            if (newUser.PermissionLevel!.Value === 2)
                                throw new Error("Você não pode tornar alguém membro.")
                            // Caso authUser ADM tornando user ADM
                            if (newUser.PermissionLevel!.Value === 3)
                                throw new Error("Você não pode tornar outro usuário um administrador.")
                            // Caso authUser ADM tornando user ROOT
                            else if (newUser.PermissionLevel!.Value === 4)
                                throw new Error("Você não pode tornar outro usuário um administrador ROOT.")
                            break
                        case 4:
                            // Caso authUser ROOT tornando user GUEST
                            if (newUser.PermissionLevel!.Value === 1)
                                throw new Error("Você não pode tornar outro usuário um convidado.")
                            // Caso authUser ROOT tornando user ROOT
                            if (newUser.PermissionLevel!.Value === 4)
                                throw new Error("Você não pode tornar outro usuário um administrador ROOT.")
                    }
                }
            }
        }
        else
        {
            if (dbUser.PermissionLevel!.Value != newUser.PermissionLevel!.Value)
                throw new Error("Você não pode editar o próprio nível.")
        }
    }
}
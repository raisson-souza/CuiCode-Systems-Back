import EmailSender from "../../classes/entities/email/EmailSender"
import SqlFormatter from "../../classes/sql/SqlFormatter"
import User from "../../classes/entities/user/User"
import UsersAccountService from "./UsersAccountService"
import UsersValidator from "../../validators/UsersValidator"

import EncryptInfo from "../../functions/security/EncryptPassword"
import FindValue from "../../functions/logic/FindValue"
import IsNil from "../../functions/logic/IsNil"
import Sleep from "../../functions/security/Sleep"
import StringifyJSON from "../../functions/formatting/StringifyJSON"
import ToSqlDate from "../../functions/SQL/ToSqlDate"

import AnySearch from "../../interfaces/AnySearch"

import EmailTitlesEnum from "../../enums/EmailTitlesEnum"

import {
    AdvancedListProps,
    CreateLogProps,
    CreateProps,
    DailyInfoProps,
    GetLogsProps,
    GetPhotoProps,
    GetProps,
    InactivateProps,
    ListProps,
    RegistryPhotoProps,
    UpdatePasswordProps,
    UpdateProps,
} from "./types/UsersServiceProps"

export default abstract class UsersService
{
    /** Cria um usuário. */
    static async Create(props : CreateProps) : Promise<void>
    {
        const { user } = props

        await UsersValidator.ValidateCreation(user, props.Db.PostgresDb)

        user.EncryptPassword()

        const generateUserFields = () => {
            return `
                "username",
                "name",
                "birthdate",
                "email",
                "recovery_email",
                "phone",
                "password",
                "password_hint",
                "sex"
            `
        }

        let query =
        `
            INSERT INTO users (${ generateUserFields() }) VALUES 
            (
                '${ user!.Username }',
                '${ user!.Name }',
                ${ ToSqlDate(user!.BirthDate) },
                '${ user!.Email }',
                '${ user!.RecoveryEmail }',
                '${ user!.Phone }',
                '${ user!.Password }',
                '${ user!.PasswordHint }',
                ${ user!.Sex!.Value }
            )
        `

        query.trim()

        await props.Db.PostgresDb.query(query)
            .then(() => {})
            .catch(ex => {
                throw new Error(ex.message);
            })

        await Sleep()

        EmailSender.Internal(EmailTitlesEnum.NEW_USER, user.GenerateUserKey())
    }

    /** Edita um usuário. */
    static async Update(props : UpdateProps) : Promise<User>
    {
        const { updatedBy, authUser, user } = props

        const dbUser = await UsersService.Get({
            Db: props.Db,
            userId: user.Id
        })
        
        const newUser = new User({ ...dbUser, ...user })

        const dbUserHash = EncryptInfo(
            JSON.stringify(Object.entries(dbUser))
        )
        const newUserHash = EncryptInfo(
            JSON.stringify(Object.entries(newUser))
        )

        if (dbUserHash === newUserHash)
            throw new Error("Nenhuma edição realizada.")

        UsersValidator.Update({
            dbUser: dbUser,
            newUser: newUser,
            userAuth: authUser,
            sameUserOperation: authUser.Id === dbUser.Id
        })

        await props.Db.PostgresDb.query(`SELECT id FROM users WHERE "email" = '${ newUser.Email }' AND "id" != ${ newUser.Id }`)
            .then(result => {
                if (result.rowCount > 0)
                {
                    if (!IsNil(FindValue(result.rows[0], ["id"])))
                        throw new Error("Email já em uso.")
                }
            })

        await props.Db.PostgresDb.query(`SELECT id FROM users WHERE "username" = '${ newUser.Username }' AND "id" != ${ newUser.Id }`)
            .then(result => {
                if (result.rowCount > 0)
                {
                    if (!IsNil(FindValue(result.rows[0], ["id"])))
                        throw new Error("Nome de usuário já em uso.")
                }
            })

        // Validação de celular / email de recuperação e afins não será implementada

        if (dbUser.Active && !user.Active)
            EmailSender.Internal(EmailTitlesEnum.USER_DEACTIVATED, `Usuário ${ dbUser.EncryptPassword() } inativado.`)

        if (!dbUser.Deleted && user.Deleted)
            EmailSender.Internal(EmailTitlesEnum.USER_DELETED, `Usuário ${ dbUser.EncryptPassword() } deletado.`)

        if (dbUser.Email != user.Email)
            newUser.EmailAproved = false

        const userModel = newUser.ConvertToSqlObject() as AnySearch
        delete userModel["modified"]
        delete userModel["modified_by"]
        const userModelEntries = Object.entries(userModel)

        /** Retorna se o nome da coluna define se o valor é data. */
        const isValueDateType = (column : string) => {
            if (
                column === '"created"' ||
                column === '"Created"' ||
                column === '"Modified"' ||
                column === '"modified"' ||
                column === '"BirthDate"' ||
                column === '"birthdate"'
            )
                return true
            return false
        }

        /** Retorna se o nome da coluna define se o valor é timestamp. */
        const isValueTimestamp = (column : string) => {
            switch (column) {
                case '"created"':
                case '"Created"':
                case '"Modified"':
                case '"modified"':
                    return true
                case '"BirthDate"':
                case '"birthdate"':
                default:
                    return false
            }
        }

        let query = "UPDATE users SET "
        userModelEntries.forEach((prop, i) => {
            if (!IsNil(prop[1]))
            {
                // Nome da coluna
                const column = `"${ prop[0] }"`
                // Valor parseado em query da coluna
                const value = SqlFormatter.EntryToQuery({
                    value: prop[1],
                    isValueDate: isValueDateType(column),
                    isValueTimestamp: isValueTimestamp(column),
                })
                // Virgula no final
                const end = i < userModelEntries.length - 1 ? ", " : ""
                // Monta a query completa
                query += `${ column } = ${ value }${ end }`
            }
        })
        query += `, modified = now(), modified_by = ${ updatedBy } WHERE id = ${ user.Id }`

        return await props.Db.PostgresDb.query(query)
            .then(async () => {
                const newUser = await UsersService.Get({
                    Db: props.Db,
                    userId: dbUser.Id
                })

                // Caso email trocado, necessita aprovar novo email
                if (!newUser.EmailAproved)
                {
                    await UsersAccountService.SendEmailApproval({
                        Db: props.Db,
                        user: newUser,
                        isCreation: false
                    })
                }

                await UsersService.UpdateLog({
                    Db: props.Db,
                    oldUser: dbUser,
                    newUser: newUser,
                    isAdmChange: updatedBy != dbUser.Id,
                    modifiedBy: updatedBy,
                    userId: dbUser.Id
                })

                return newUser
            })
    }

    /** Inativa um usuário. */
    static async Inactivate(props : InactivateProps) : Promise<void>
    {
        throw new Error("Method not implemented.");
    }

    /** Captura um usuário. */
    static async Get(props : GetProps) : Promise<User>
    {
        if (IsNil(props.userId))
            throw new Error("Id de usuário não informado.")

        const query = `SELECT * FROM users WHERE id = ${ props.userId }`
        
        return await props.Db.PostgresDb.query(query)
            .then(result => {
                if (result.rowCount === 0)
                    throw new Error("Nenhum usuário encontrado.")

                return new User(result.rows[0])
            })
            .catch(ex => { throw new Error(ex.message) })
    }

    /** Captura a foto de um usuário. */
    static async GetPhoto(props : GetPhotoProps) : Promise<string>
    {
        throw new Error("Method not implemented.");
    }

    /** Registra a foto de um usuário. */
    static async RegistryPhoto(props : RegistryPhotoProps) : Promise<string>
    {
        throw new Error("Method not implemented.");
    }

    /** Lista usuários. */
    static async List(props : ListProps) : Promise<User[]>
    {
        throw new Error("Method not implemented.");
    }

    /** Lista usuários de forma avançada. */
    static async AdvancedList(props : AdvancedListProps) : Promise<User[]>
    {
        throw new Error("Method not implemented.");
    }

    /** Captura informações diárias de um usuário. */
    static async DailyInfo(props : DailyInfoProps) : Promise<void>
    {
        throw new Error("Method not implemented.");
    }

    /** Captura os logs de um usuário. */
    static async GetLogs(props : GetLogsProps) : Promise<void>
    {
        throw new Error("Method not implemented.");
    }

    /** Atualiza a senha de um usuário. */
    static async UpdatePassword(props : UpdatePasswordProps) : Promise<void>
    {
        throw new Error("Method not implemented.");
    }

    /** Grava log de modificação de usuário. Retorna o ID do log gerado. */
    static async UpdateLog(props : CreateLogProps) : Promise<number>
    {
        const { userId, oldUser, newUser, isAdmChange, modifiedBy } = props

        type UserLog = {
            [ key : string ] : string[] | number[] | boolean[] | Date[] | null
        }

        const userLog : UserLog = {
            active: oldUser.Active != newUser.Active
                ? [oldUser.Active, newUser.Active]
                : null,
            deleted: oldUser.Deleted != newUser.Deleted
                ? [oldUser.Deleted, newUser.Deleted]
                : null,
            birthdate: oldUser.BirthDate.getTime() != newUser.BirthDate.getTime()
                ? [oldUser.BirthDate, newUser.BirthDate]
                : null,
            email: oldUser.Email != newUser.Email
                ? [oldUser.Email, newUser.Email]
                : null,
            name: oldUser.Name != newUser.Name
                ? [oldUser.Name, newUser.Name]
                : null,
            permission_level: oldUser.PermissionLevel!.Value != newUser.PermissionLevel!.Value
                ? [oldUser.PermissionLevel!.Value, newUser.PermissionLevel!.Value]
                : null,
            phone: oldUser.Phone != newUser.Phone
                ? [oldUser.Phone, newUser.Phone]
                : null,
            photo_base_64: oldUser.PhotoBase64 != newUser.PhotoBase64
                ? [oldUser.PhotoBase64, newUser.PhotoBase64]
                : null,
            recovery_email: oldUser.RecoveryEmail != newUser.RecoveryEmail
                ? [oldUser.RecoveryEmail, newUser.RecoveryEmail]
                : null,
            sex: oldUser.Sex!.Value != newUser.Sex!.Value
                ? [oldUser.Sex!.Value, newUser.Sex!.Value]
                : null,
            username: oldUser.Username != newUser.Username
                ? [oldUser.Username, newUser.Username]
                : null,
        }

        let query = `INSERT INTO users_logs ("user_id", "change", "adm_change", "modified_by") VALUES (${ userId }, '${ StringifyJSON(userLog) }', '${ isAdmChange }', '${ modifiedBy }') RETURNING id`

        return await props.Db.PostgresDb.query(query)
            .then(result => {
                return Number.parseInt(FindValue(result.rows[0], ["id"]))
            })
            .catch(ex => {
                throw new Error(ex.message)
            })
    }
}
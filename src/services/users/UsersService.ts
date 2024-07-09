import EmailSender from "../../classes/entities/email/EmailSender"
import ModulesService from "../system/ModulesService"
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
import ModulesEnum from "../../enums/ModulesEnum"
import UsersFilterEnum from "../../enums/modules/UsersFilterEnum"
import UsersVisualizationEnum from "../../enums/modules/UsersVisualizationEnum"

import {
    CreateLogProps,
    CreateProps,
    DailyInfoProps,
    DailyInfoReturn,
    FindEmailProps,
    GetLogsProps,
    GetLogsReturn,
    GetPhotoProps,
    GetProps,
    InactivateProps,
    ListProps,
    ListReturn,
    RegistryPhotoProps,
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
    static async Get({
        Db,
        userId,
        visualizationEnum = UsersVisualizationEnum.AllNoPhoto
    } : GetProps) : Promise<User>
    {
        if (IsNil(userId))
            throw new Error("Id de usuário não informado.")

        const query = `SELECT u.id, u.created, u.permission_level, u.username, u.deleted, u.active, ${ this.buildVisualizationQuery(visualizationEnum) } WHERE u.id = ${ userId }`

        return await Db.PostgresDb.query(query)
            .then(result => {
                if (result.rowCount === 0)
                    throw new Error("Nenhum usuário encontrado.")

                return new User(result.rows[0])
            })
            .catch(ex => { throw new Error(ex.message) })
    }

    /** Captura a foto de um usuário. */
    static async GetPhoto(props : GetPhotoProps) : Promise<string | null>
    {
        const query = `SELECT photo_base_64 FROM users_photos WHERE user_id = ${ props.userId }`

        return await props.Db.PostgresDb.query(query)
            .then(result => {
                return !IsNil(result.rows[0])
                    ? result.rows[0]["photo_base_64"]
                    : null
            })
            .catch(ex => {
                throw new Error(ex.message)
            })
    }

    /** Registra a foto de um usuário. */
    static async RegistryPhoto(props : RegistryPhotoProps) : Promise<void>
    {
        let query = ""

        const dbPhoto = await this.GetPhoto({
            Db: props.Db,
            userId: props.userId
        })

        if (!IsNil(dbPhoto))
            query = `UPDATE users_photos SET photo_base_64 = '${ props.photo }', modified = now() WHERE "user_id" = '${ props.userId }'`
        else
            query = `INSERT INTO users_photos (user_id, photo_base_64) VALUES (${ props.userId }, '${ props.photo }')`

        await props.Db.PostgresDb.query(query)
            .catch(ex => { throw new Error(ex.message) })
    }

    /** Lista usuários. */
    static async List({
        Db,
        filterEnum = UsersFilterEnum.NoFilter,
        visualizationEnum = UsersVisualizationEnum.All,
        pagination = {
            limit: 20
        }
    } : ListProps) : Promise<ListReturn>
    {
        let query = `SELECT u.id, u.created, u.permission_level, u.username, u.deleted, u.active, ${ this.buildVisualizationQuery(visualizationEnum) } WHERE`

        switch (filterEnum)
        {
            case UsersFilterEnum.NoFilter:
                query = query.replace(' WHERE', '')
                break
            case UsersFilterEnum.AllActive:
                query += " u.active IS TRUE"
                break
            case UsersFilterEnum.AllDeleted:
                query += " u.deleted IS TRUE"
                break
            case UsersFilterEnum.AllInactive:
                query += " u.active IS FALSE"
                break
            case UsersFilterEnum.AllEmailApproved:
                query += " u.email_approved IS TRUE"
                break
            case UsersFilterEnum.AllEmailUnnaproved:
                query += " u.email_approved IS FALSE"
                break
            case UsersFilterEnum.AllMonthBirthdays:
                query += " extract(MONTH FROM u.birthdate) = extract(MONTH FROM CURRENT_DATE)"
                break
            case UsersFilterEnum.AllAdms:
                query += " permission_level IN (3, 4)"
                break
            case UsersFilterEnum.AllMembers:
                query += " permission_level = 2"
                break
            case UsersFilterEnum.AllWithPhoto:
                if (
                    visualizationEnum === UsersVisualizationEnum.All ||
                    visualizationEnum === UsersVisualizationEnum.Resume ||
                    visualizationEnum === UsersVisualizationEnum.Queote
                )
                    query += " up.photo_base_64 IS NOT NULL"
                break
            case UsersFilterEnum.AllWithoutPhoto:
                if (
                    visualizationEnum === UsersVisualizationEnum.All ||
                    visualizationEnum === UsersVisualizationEnum.Resume ||
                    visualizationEnum === UsersVisualizationEnum.Queote
                )
                    query += " up.photo_base_64 IS NULL"
                break
            case UsersFilterEnum.AllWomen:
                query += " sex = 2"
                break
            case UsersFilterEnum.AllMen:
                query += " sex = 2"
                break
            default:
                query += ""
        }

        query += ` ORDER BY u.id DESC LIMIT ${ pagination.limit }`

        return await Db.PostgresDb.query(query)
            .then(result => {
                const dataPagination : ListReturn = {
                    data: [],
                    pagination: {
                        records: result.rowCount,
                        limit: pagination.limit
                    }
                }

                result.rows.map(row => {
                    dataPagination.data.push(new User(row))
                })

                return dataPagination
            })
            .catch(ex => {
                throw new Error(ex.message)
            })
    }

    /** Captura informações diárias de um usuário. */
    static async DailyInfo(props : DailyInfoProps) : Promise<DailyInfoReturn>
    {
        const { userId } = props

        const modules = await ModulesService.List({
            Db: props.Db
        })

        /** GRUPOS */
        // PRÉ IMPLEMENTAÇÃO DA BUSCA DE GRUPOS INCLUIDOS
        let groups : any[] = []

        if (modules.filter(module => { return module.ModuleEnum === ModulesEnum.Groups && !module.Active }))
            groups = []
        else
        {
            // ...
        }
        // TRANSFORMAR EM DTO E PEGAR NAME E ID

        /** SOLICITAÇÕES */
        // PRÉ IMPLEMENTAÇÃO DA BUSCA DE SOLICITAÇÕES ATENDIDAS
        let solicitations : any[] = []
        // TRANSFORMAR EM DTO E PEGAR NAME E ID

        // PRÉ IMPLEMENTAÇÃO DA BUSCA DE SOLICITAÇÕES ATENDIDAS PELO GRUPO INCLUIDO
        let solicitationsByGroup : any[] = []
        // TRANSFORMAR EM DTO E PEGAR NAME E ID

        if (modules.filter(module => { return module.ModuleEnum === ModulesEnum.Solicitations && !module.Active }))
        {
            solicitations = []
            solicitationsByGroup = []
        }
        else
        {
            // ...
            solicitations.concat(solicitationsByGroup)
        }

        const myDelayedSolicitations = solicitations
            .filter(solicitation => {
                solicitation.final_date.getTime() < new Date().getTime()
            })
            .map(delayedSolicitation => { return delayedSolicitation })

        /** CHATS */
        // PRÉ IMPLEMENTAÇÃO DA BUSCA DE CHATS INCLUIDOS
        let chats : any[] = []

        if (modules.filter(module => { return module.ModuleEnum === ModulesEnum.Groups && !module.Active }))
            chats = []
        else
        {
            // ...
        }

        const chatsQuantity = chats.length

        /** MORFEUS */
        // PRÉ IMPLEMENTAÇÃO DA BUSCA DE SONHOS
        let morfeusDreams : any[] = []

        if (modules.filter(module => { return module.ModuleEnum === ModulesEnum.Morfeus && !module.Active }))
            morfeusDreams = []
        else
        {
            // ...
        }

        const dreamsQuantity = morfeusDreams.length

        /** HESTIA */
        // PRÉ IMPLEMENTAÇÃO DA BUSCA DE TASKS HESTIA
        let hestiaTasks : any[] = []

        if (modules.filter(module => { return module.ModuleEnum === ModulesEnum.Hestia && !module.Active }))
            hestiaTasks = []
        else
        {
            // ...
        }

        const hestiaTasksThisWeekQuantity = hestiaTasks
            .filter(() => {})
            .map(task => { return task })
            .length
        const hestiaTasksPendingQuantity = hestiaTasks
            .filter(() => {})
            .map(task => { return task })
            .length

        /** MINERVA */
        // PRÉ IMPLEMENTAÇÃO DA BUSCA DE PLANOS MINERVA
        let minervaPlans : any[] = []

        if (modules.filter(module => { return module.ModuleEnum === ModulesEnum.Hestia && !module.Active }))
            minervaPlans = []
        else
        {
            // ...
        }

        const minervaOpenPlansQuantity = minervaPlans.length

        return {
            groups: groups,
            solicitations: solicitations,
            delayedSolicitations: myDelayedSolicitations,
            chatsNumber: chatsQuantity,
            dreamsNumber: dreamsQuantity,
            hestiaTasksThisWeekNumber: hestiaTasksThisWeekQuantity,
            hestiaPendingTasksNumber: hestiaTasksPendingQuantity,
            minervaOpenPlans: minervaOpenPlansQuantity
        }
    }

    /** Captura os logs de um usuário. */
    static async GetLogs(props : GetLogsProps) : Promise<GetLogsReturn[]>
    {
        const { userId, initialDate, finalDate } = props

        let query = `SELECT * FROM users_logs WHERE user_id = ${ userId }`

        if (!IsNil(initialDate) && !IsNil(finalDate))
            query += ` AND "date" > '${ SqlFormatter.ToSqlDateComparison(initialDate!) }' AND "date" < '${ SqlFormatter.ToSqlDateComparison(finalDate!) }'`
        else if (!IsNil(initialDate))
            query += ` AND "date" > '${ SqlFormatter.ToSqlDateComparison(initialDate!) }'`
        else if (!IsNil(finalDate))
            query += ` AND "date" < '${ SqlFormatter.ToSqlDateComparison(finalDate!) }'`

        query += " ORDER BY id DESC"

        return await props.Db.PostgresDb.query(query)
            .then(result => {
                const logsQuery : GetLogsReturn[] = []

                result.rows.map(log => {
                    // TODO: a data puxada do banco é adianta em 3hrs devido ao express
                    logsQuery.push(log)
                })

                return logsQuery
            })
            .catch(ex => {
                throw new Error(ex.message)
            })
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
            photo_base_64: oldUser.Photo != newUser.Photo
                ? [oldUser.Photo, newUser.Photo]
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
            password: oldUser.Password != newUser.Password
                ? [oldUser.Password, newUser.Password]
                : null,
            password_hint: oldUser.PasswordHint != newUser.PasswordHint
                ? [oldUser.PasswordHint, newUser.PasswordHint]
                : null
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

    /** Busca o email de um usuário. */
    static async FindEmail(props : FindEmailProps) : Promise<boolean>
    {
        SqlFormatter.SqlInjectionVerifier([props.email])

        const query = `SELECT COUNT(*) FROM users WHERE "email" = '${ props.email }'`

        return await props.Db.PostgresDb.query(query)
            .then(result => {
                return Number.parseInt(result.rows[0]["count"]) > 0
            })
            .catch(ex => {
                throw new Error(ex.message)
            })
    }

    /** Contrutor de query com filtro de visualização (aproveitamento de código para Get e List). */
    private static buildVisualizationQuery(visualizationEnum : UsersVisualizationEnum = UsersVisualizationEnum.All) : string
    {
        switch (visualizationEnum)
        {
            case UsersVisualizationEnum.All:
                return "u.password, u.password_hint, u.birthdate, u.email, u.modified, u.modified_by, u.name, u.phone, u.recovery_email, u.sex, up.photo_base_64 FROM users u LEFT JOIN users_photos up ON u.id = up.user_id"
            case UsersVisualizationEnum.AllNoPhoto:
                return "u.password, u.password_hint, u.birthdate, u.email, u.modified, u.modified_by, u.name, u.phone, u.recovery_email, u.sex FROM users u"
            case UsersVisualizationEnum.Resume:
                return "u.birthdate, u.email, u.modified, u.name, u.phone, u.sex, up.photo_base_64 FROM users u LEFT JOIN users_photos up ON u.id = up.user_id"
            case UsersVisualizationEnum.ResumeNoPhoto:
                return " u.birthdate, u.email, u.modified, u.name, u.phone, u.sex FROM users u"
            case UsersVisualizationEnum.Queote:
                return "u.modified, u.name, u.sex, up.photo_base_64 FROM users u LEFT JOIN users_photos up ON u.id = up.user_id"
            case UsersVisualizationEnum.QueoteNoPhoto:
                return "u.modified, u.name, u.sex FROM users u"
            default:
                return "FROM users u"
        }
    }
}
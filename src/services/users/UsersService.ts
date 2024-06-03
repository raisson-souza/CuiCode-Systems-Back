import EmailSender from "../../classes/entities/email/EmailSender"
import User from "../../classes/entities/user/User"
import UsersValidator from "../../validators/UsersValidator"

import IsNil from "../../functions/logic/IsNil"
import Sleep from "../../functions/security/Sleep"
import ToSqlDate from "../../functions/SQL/ToSqlDate"

import EmailTitlesEnum from "../../enums/EmailTitlesEnum"

import {
    AdvancedUsersListProps,
    CreateUserProps,
    DailyInfoProps,
    GetUserLogsProps,
    GetUserPhotoProps,
    GetUserProps,
    InactivateUserProps,
    ListUsersProps,
    RegistryUserPhotoProps,
    UpdatePasswordProps,
    UpdateUserProps,
} from "./types/UsersServiceProps"

export default abstract class UsersService
{
    /** Cria um usuário. */
    static async CreateUser(createUserProps : CreateUserProps) : Promise<void>
    {
        const { user } = createUserProps

        await UsersValidator.ValidateCreation(user, createUserProps.Db.PostgresDb)

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

        await createUserProps.Db.PostgresDb.query(query)
            .then(() => {})
            .catch(ex => {
                throw new Error(ex.message);
            })

        await Sleep()

        EmailSender.Internal(EmailTitlesEnum.NEW_USER, user.GenerateUserKey())
    }

    /** Edita um usuário. */
    static async UpdateUser(updateUserProps : UpdateUserProps) : Promise<User>
    {
        throw new Error("Method not implemented.");
    }

    /** Inativa um usuário. */
    static async InactivateUser(inactivateUserProps : InactivateUserProps) : Promise<void>
    {
        throw new Error("Method not implemented.");
    }

    /** Captura um usuário. */
    static async GetUser(getUserProps : GetUserProps) : Promise<User>
    {
        if (IsNil(getUserProps.userId))
            throw new Error("Id de usuário não informado.")

        const query = `SELECT * FROM users WHERE id = ${ getUserProps.userId }`
        
        return await getUserProps.Db.PostgresDb.query(query)
            .then(result => {
                if (result.rowCount === 0)
                    throw new Error("Nenhum usuário encontrado.")

                return new User(result.rows[0])
            })
            .catch(ex => { throw new Error(ex.message) })
    }

    /** Captura a foto de um usuário. */
    static async GetUserPhoto(getUserPhotoProps : GetUserPhotoProps) : Promise<string>
    {
        throw new Error("Method not implemented.");
    }

    /** Registra a foto de um usuário. */
    static async RegistryUserPhoto(registryUserPhotoProps : RegistryUserPhotoProps) : Promise<string>
    {
        throw new Error("Method not implemented.");
    }

    /** Lista usuários. */
    static async ListUsers(listUsersProps : ListUsersProps) : Promise<User[]>
    {
        throw new Error("Method not implemented.");
    }

    /** Lista usuários de forma avançada. */
    static async AdvancedUsersList(advancedUsersListProps : AdvancedUsersListProps) : Promise<User[]>
    {
        throw new Error("Method not implemented.");
    }

    /** Captura informações diárias de um usuário. */
    static async DailyInfo(dailyInfoProps : DailyInfoProps) : Promise<void>
    {
        throw new Error("Method not implemented.");
    }

    /** Captura os logs de um usuário. */
    static async GetUserLogs(getUserLogsProps : GetUserLogsProps) : Promise<void>
    {
        throw new Error("Method not implemented.");
    }

    /** Atualiza a senha de um usuário. */
    static async UpdatePassword(updatePasswordProps : UpdatePasswordProps) : Promise<void>
    {
        throw new Error("Method not implemented.");
    }
}
import SendApprovalEmailOperation from "../services/email/SendApprovalUserEmailOperation"

import ServerService from "../../../classes/service/ServerService"

import User from "../../../classes/entities/user/User"
import UserRepository from "../../../classes/entities/user/UserRepository"

import EmailSender from "../../../functions/system/EmailSender"
import IsUndNull from "../../../functions/IsUndNull"
import Send from "../../../functions/system/Send"
import ToSqlDate from "../../../functions/SQL/ToSqlDate"

import EmailTitles from "../../../enums/EmailTitlesEnum"

/**
 * Creates a user.
 */
class CreateUserService extends ServerService
{
    // A criação de usuário não necessita de um usuário requeridor.
    Action : string = "Criação de Usuário."

    CheckBody() : User
    {
        const body = this.REQ.body as any

        if (IsUndNull(body))
            throw new Error("Corpo da requisição inválido.")

        return new User(body)
    }

    CheckQuery() { throw new Error("Method not implemented.") }

    async Operation()
    {
        try
        {
            const {
                RES,
                DB_connection,
                Action
            } = this

            const user = this.CheckBody()

            await UserRepository.ValidateCreation(user, DB_connection)

            user.EncryptPassword()

            await this.PersistUserCreation(user)

            Send.Ok(RES, `Usuário ${ user.GenerateUserKey() } criado com sucesso.`, Action)

            new EmailSender().Internal(EmailTitles.NEW_USER, user.GenerateUserKey())

            await new SendApprovalEmailOperation(user, DB_connection).PerformOperation(true)
        }
        catch (ex)
        {
            Send.Error(this.RES, `Houve um erro ao criar o usuário. Erro: ${ (ex as Error).message }`, this.Action)
        }
        finally
        {
            this.DB_connection.end()
        }
    }

    private async PersistUserCreation(user : User)
    {
        let query =
        `
            INSERT INTO users (${ this.GenerateUserFields() }) VALUES 
            (
                '${ user!.Username }',
                '${ user!.Name }',
                ${ ToSqlDate(user!.BirthDate) },
                '${ user!.Email }',
                '${ user!.RecoveryEmail }',
                '${ user!.Phone }',
                '${ user!.Password }',
                '${ user!.PasswordHint }',
                '${ user!.PhotoBase64 }',
                ${ user!.Sex!.Value }
            )
        `

        query.trim()

        await this.DB_connection.query(query)
            .then(() => {})
            .catch(ex => {
                throw new Error(ex.message);
            })
    }

    private GenerateUserFields() : string
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
}

export default CreateUserService
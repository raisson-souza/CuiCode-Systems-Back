import SendApprovalEmailOperation from "../services/email/SendApprovalUserEmailOperation"

import Operation from "../../../classes/service/base/Operation"
import ServerService from "../../../classes/service/ServerService"
import User from "../../../classes/entities/user/User"
import UserRepository from "../../../classes/entities/user/UserRepository"

import EmailSender from "../../../functions/system/EmailSender"
import EncryptPassword from "../../../functions/EncryptPassword"
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

            const userOperation = new CreateUserOperation(user, DB_connection)
            await userOperation.PerformOperation()

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
}

/**
 * Creates a user.
 */
class CreateUserOperation extends Operation
{
    async PerformOperation()
    {
        try
        {
            this.EncryptUserPassword(this.User!)

            const {
                User,
                DB_connection
            } = this

            let query =
            `
                INSERT INTO users (${ this.GenerateUserFields() }) VALUES 
                (
                    '${ User!.Username }',
                    '${ User!.Name }',
                    ${ ToSqlDate(User!.BirthDate) },
                    '${ User!.Email }',
                    '${ User!.RecoveryEmail }',
                    '${ User!.Phone }',
                    '${ User!.Password }',
                    '${ User!.PasswordHint }',
                    '${ User!.PhotoBase64 }',
                    ${ User!.Sex!.Value }
                )
            `

            query.trim()

            await DB_connection.query(query)
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

    private EncryptUserPassword(user : User) : void
    {
        user.Password = EncryptPassword(user.Password)
    }
}

export default CreateUserService
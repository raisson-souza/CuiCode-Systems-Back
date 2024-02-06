import SendApprovalEmailOperation from "../services/email/SendApprovalUserEmailOperation"

import ServerService from "../../../classes/service/ServerService"

import EmailSender from "../../../classes/entities/email/EmailSender"
import ResponseMessage from "../../../classes/system/ResponseMessage"
import User from "../../../classes/entities/user/User"
import UserRepository from "../../../repositories/UserRepository"

import IsUndNull from "../../../functions/IsUndNull"
import ToSqlDate from "../../../functions/SQL/ToSqlDate"

import EmailTitles from "../../../enums/EmailTitlesEnum"
import HttpStatusEnum from "../../../enums/system/HttpStatusEnum"

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

            ResponseMessage.Send(
                HttpStatusEnum.CREATED,
                `Usuário ${ user.GenerateUserKey() } criado com sucesso.`,
                Action,
                RES
            )

            EmailSender.Internal(EmailTitles.NEW_USER, user.GenerateUserKey())

            await new SendApprovalEmailOperation(user, DB_connection).PerformOperation(true)
        }
        catch (ex)
        {
            ResponseMessage.Send(
                HttpStatusEnum.INTERNAL_SERVER_ERROR,
                `Houve um erro ao criar o usuário. Erro: ${ (ex as Error).message }`,
                this.Action,
                this.RES
            )
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
            "sex"
        `
    }
}

export default CreateUserService
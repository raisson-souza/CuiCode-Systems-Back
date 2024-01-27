import SendApprovalEmailOperation from "../services/email/SendApprovalUserEmailOperation"

import ValidateUser from "../utilities/ValidateUser"

import Operation from "../../../classes/Operation"
import ServerService from "../../../classes/service/ServerService"
import User from "../../../classes/User"

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

        return new User(body, false, true)
    }

    CheckQuery() { throw new Error("Method not implemented.") }

    async Operation()
    {
        try
        {
            const {
                REQ,
                RES,
                DB_connection,
                Action
            } = this

            const user = this.CheckBody()

            await Promise.resolve(ValidateUser(DB_connection, user, true))
                .then(async () => {
                    await Promise.resolve(new CreateUserOperation(user, DB_connection).PerformOperation())
                        .then(async () => {
                            Send.Ok(RES, `Usuário ${ user.GenerateUserKey() } criado com sucesso.`, Action)
                            new EmailSender().Internal(EmailTitles.NEW_USER, user.GenerateUserKey())
                            await new SendApprovalEmailOperation(user, DB_connection).PerformOperation(true)
                        })
                        .catch(ex => {
                            Send.Error(RES, `Houve um erro ao criar o usuário. Erro: ${ ex.message }`, Action)
                        })
                })
                .catch(ex => {
                    Send.Error(RES, `Houve um erro ao criar o usuário. Erro: ${ ex.message }`, Action)
                })
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
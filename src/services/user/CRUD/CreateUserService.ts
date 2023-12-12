import Service from "../../../classes/Service"
import User from "../../../classes/User"

import SendApprovalEmailOperation from "../services/email/SendApprovalUserEmailOperation"

import CreateUser from "../utilities/CreateUser"
import ValidateUser from "../utilities/ValidateUser"

import Send from "../../../functions/Responses"
import EmailSender from "../../../functions/system/EmailSender"
import IsUndNull from "../../../functions/IsUndNull"

import EmailTitles from "../../../enums/EmailTitlesEnum"

/**
 * Creates a user.
 */
class CreateUserService extends Service
{
    // A criação de usuário não necessita de um usuário requeridor.
    Action : string = "Criação de Usuário"

    CheckBody(body : any) : User
    {
        if (IsUndNull(body))
            throw new Error("Corpo da requisição inválido.")

        return new User(body, false, true)
    }

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

            const user = this.CheckBody(REQ.body)

            await Promise.resolve(ValidateUser(DB_connection, user, true))
                .then(async () => {
                    await Promise.resolve(CreateUser(DB_connection, user))
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

export default CreateUserService
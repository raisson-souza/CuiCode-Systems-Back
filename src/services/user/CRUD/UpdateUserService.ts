import Service from "../../../classes/Service"
import User from "../../../classes/User"

import SendApprovalEmailOperation from "../services/email/SendApprovalUserEmailOperation"

import ValidateUser from "../utilities/ValidateUser"
import UpdateUser from "../utilities/UpdateUser"

import Send from "../../../functions/Responses"
import IsUndNull from "../../../functions/IsUndNull"

/**
 * Updates a user
 */
class UpdateUserService extends Service
{
    Action = "Edição de usuário."

    CheckBody(body : any) : User
    {
        if (IsUndNull(body))
            throw new Error("Corpo da requisição inválido.")

        const user = new User(body, false, false, true);

        if (IsUndNull(user.Id))
            throw new Error("Id de usuário a ser atualizado não encontrado.")

        return user
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

            await ValidateUser(DB_connection, user, false)

            await Promise.resolve(UpdateUser(DB_connection, user))
                .then(() => {
                    Send.Ok(RES, `Usuário editado com sucesso.`, Action)
                })
                .catch(ex => {
                    throw new Error((ex as Error).message)
                })

            if (!IsUndNull(user.EmailAproved) && !user.EmailAproved)
                await new SendApprovalEmailOperation(user, DB_connection).PerformOperation()
        }
        catch (ex)
        {
            Send.Error(this.RES, `Houve um erro ao editar o usuário. Erro: ${ (ex as Error).message }`, this.Action)
        }
        finally
        {
            this.DB_connection.end()
        }
    }
}

export default UpdateUserService
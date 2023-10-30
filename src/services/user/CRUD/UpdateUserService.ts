import Service from "../../../classes/Service"
import User from "../../../classes/User"

import SendApprovalEmailOperation from "../services/email/SendApprovalUserEmailOperation"

import ValidateUser from "../utilities/ValidateUser"
import UpdateUser from "../utilities/UpdateUser"

import Send from "../../../functions/Responses"
import IsUndNull from "../../../functions/IsUndNull"

/**
 * Updates a user.
 */
export default async function UpdateUserService
(
    service : Service
)
: Promise<void> 
{
    const action = "Edição de usuário"

    try
    {
        const {
            REQ,
            RES,
            DB_connection,
        } = service

        if (REQ.method != "PUT")
            return Send.MethodNotAllowed(RES, "Método não autorizado.", action)

        const user = CheckBody(REQ.body)

        await ValidateUser(DB_connection, user, false)

        await Promise.resolve(UpdateUser(DB_connection, user))
            .then(() => {
                Send.Ok(RES, `Usuário editado com sucesso.`, action)
            })
            .catch(ex => {
                throw new Error((ex as Error).message)
            })

        if (!IsUndNull(user.EmailAproved) && !user.EmailAproved)
            await SendApprovalEmailOperation(user, DB_connection)
    }
    catch (ex)
    {
        Send.Error(service.RES, `Houve um erro ao editar o usuário. Erro: ${ (ex as Error).message }`, action)
    }
    finally
    {
        service.DB_connection.end()
    }
}

function CheckBody(body : any) : User
{
    if (IsUndNull(body))
        throw new Error("Corpo da requisição inválido.");

    const user = new User(body, false, false, true);

    if (IsUndNull(user.Id))
        throw new Error("Id de usuário a ser atualizado não encontrado.");

    return user
}

import User from "../../classes/User"

import ValidateUser from "./utilities/ValidateUser"
// import SetUser from "./utilities/SetUser"

import Send from "../../functions/Responses"
import IsUndNull from "../../functions/IsUndNull"
import Service from "../../classes/Service"

/**
 * Updates a user.
 * @param req User object
 * @param res 
 * @param db 
 * @param admin 
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
            DB_stage
        } = service

        if (REQ.method != "PUT")
            return Send.MethodNotAllowed(RES, "Método não autorizado.", action)

        const user = CheckBody(REQ.body)
        const userKey = user.GenerateUserKey()

        // CORRIGIR
    }
    catch (ex)
    {
        Send.Error(service.RES, `Houve um erro ao editar o usuário. Erro: ${ (ex as Error).message }`, action)
    }
}

function CheckBody(body : any) : User
{
    if (IsUndNull(body))
        throw new Error("Corpo da requisição inválido.");

    const user = new User(body, true);

    if (IsUndNull(user.Id))
        throw new Error("Id de usuário a ser atualizado não encontrado.");

    return user
}

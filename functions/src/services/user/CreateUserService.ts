import User from "../../classes/User"

// import ValidateUser from "./utilities/ValidateUser"
// import SetUser from "./utilities/SetUser"

import Send from "../../functions/Responses"
import Service from "../../classes/Service"

/**
 * Creates a user.
 */
export default async function CreateUserService
(
    service : Service
)
: Promise<void>
{
    const action = "Criação de usuário"

    try
    {
        const {
            REQ,
            RES,
            DB_connection,
            DB_stage
        } = service

        if (REQ.method != "POST")
            return Send.MethodNotAllowed(RES, "Método não autorizado.", action)

        const user = CheckBody(REQ.body)

        // CORRIGIR!
    }
    catch (ex)
    {
        Send.Error(service.RES, `Houve um erro ao criar o usuário. Erro: ${ (ex as Error).message }`, action)
    }
}

function CheckBody(body : any) : User
{
    return new User(body)
}

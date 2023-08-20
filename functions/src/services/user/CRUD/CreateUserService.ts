import Service from "../../../classes/Service"
import User from "../../../classes/User"

import CreateUser from "../utilities/CreateUser"
import ValidateUser from "../utilities/ValidateUser"

import Send from "../../../functions/Responses"

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
            DB_stage,
        } = service

        if (REQ.method != "POST")
            return Send.MethodNotAllowed(RES, "Método não autorizado.", action)

        const user = CheckBody(REQ.body)

        await Promise.resolve(ValidateUser(DB_connection, DB_stage, user))
            .then(async () => {
                // VALIDAR DATA PARA FUSO BR
                user.CreatedDate = new Date()

                await Promise.resolve(CreateUser(DB_connection, DB_stage, user))
                    .then(() => {
                        Send.Ok(RES, `Usuário ${ user.GenerateUserKey() } criado com sucesso.`, action)
                    })
                    .catch(ex => {
                        Send.Error(RES, `Houve um erro ao criar o usuário. Erro: ${ ex.message }`, action)
                    })
            })
            .catch(ex => {
                Send.Error(RES, `Houve um erro ao criar o usuário. Erro: ${ ex.message }`, action)
            })
    }
    catch (ex)
    {
        Send.Error(service.RES, `Houve um erro ao criar o usuário. Erro: ${ (ex as Error).message }`, action)
    }
    finally
    {
        service.DB_connection.end()
    }
}

// A criação de usuário não necessita de um usuário requeridor.

function CheckBody(body : any) : User
{
    return new User(body)
}

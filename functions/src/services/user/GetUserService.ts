import QueryUser from "./utilities/QueryUser"

import IsUndNull from "../../functions/IsUndNull"
import Send from "../../functions/Responses"
import Service from "../../classes/Service"

/**
 * Queries a user.
 */
export default async function GetUserService
(
    service : Service
)
: Promise<void>
{
    const action = "Consulta de usuário."

    try
    {
        const {
            REQ,
            RES,
            DB_connection,
            DB_stage
        } = service

        if (REQ.method != "GET")
            return Send.MethodNotAllowed(RES, "Método não autorizado.", action)

        const userId = CheckQuery(REQ.query)

        await Promise.resolve(QueryUser(DB_connection, DB_stage, userId))
            .then(user => {
                Send.Ok(RES, user, action)
            })
            .catch(ex => {
                Send.Error(RES, `Houve um erro ao consultar o usuário. Erro: ${ ex.message }`, action)
            })
    }
    catch (ex)
    {
        Send.Error(service.RES, `Houve um erro ao consultar o usuário. Erro: ${ (ex as Error).message }`, action)
    }
    finally
    {
        service.DB_connection.end()
    }
}

function CheckQuery(query : any) : number
{
    if (IsUndNull(query.UserId))
        throw new Error("Id de usuário não encontrado na URL.");

    if (query.UserId < 0)
        throw new Error("Id de usuário inválido.");

    return Number.parseInt(query.UserId)
}

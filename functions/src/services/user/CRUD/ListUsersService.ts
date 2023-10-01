import IsUndNull from "../../../functions/IsUndNull"
import Send from "../../../functions/Responses"

import QueryUsersInfo from "../utilities/QueryUsersInfo"

import Service from "../../../classes/Service"

/**
 * Queries specific information about all users.
 * @param req requiredInfo = {Part of User object}
 * @param res 
 * @param db 
 */
export default async function ListUsersService
(
    service : Service
)
: Promise<void>
{
    const action = "Listagem de usuários."

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

        // O FRONT-END DEVE ENVIAR AS INFORMAÇÕES JÁ CONVERTIDAS PARA OS MESMOS CAMPOS DO BANCO
        const userRequiredInfo = CheckQuery(REQ.query)

        await Promise.resolve(QueryUsersInfo(DB_connection, DB_stage, userRequiredInfo))
            .then(userInfos => {
                Send.Ok(RES, userInfos, action)
            })
            .catch(ex => {
                Send.Error(RES, `Houve um erro ao listar as informações requeridas dos usuários. Erro: ${ ex.message }`, action)
            })
    }
    catch (ex)
    {
        Send.Error(service.RES, `Houve um erro ao listar as informações requeridas dos usuários. Erro: ${ (ex as Error).message }`, action)
    }
    finally
    {
        service.DB_connection.end()
    }
}

function CheckQuery(query : any) : Array<string>
{
    if (IsUndNull(query.RequiredInfo))
        throw new Error("Informações requeridas dos usuários não encontradas na URL.")

    const JsonConvertedQuery = JSON.parse(query.RequiredInfo)

    const RequiredInfoArray = new Array(JsonConvertedQuery)

    return RequiredInfoArray[0]
}

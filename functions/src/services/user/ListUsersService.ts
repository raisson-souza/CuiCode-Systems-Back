import {
    Request,
    Response,
} from "firebase-functions"

import IsUndNull from "../../functions/IsUndNull"
import Send from "../../functions/Responses"

import QueryUsersInfo from "./utilities/QueryUsersInfo"

/**
 * Queries specific information about all users.
 * @param req requiredInfo = {Part of User object}
 * @param res 
 * @param db 
 */
export default async function ListUsersService
(
    req : Request,
    res : Response,
    db : any,
)
: Promise<void>
{
    const action = "Listagem de usuários."
    try
    {
        if (req.method != "GET")
            return Send.MethodNotAllowed(res, "Método não autorizado.", action)

        const userRequiredInfo = CheckQuery(req.query)

        await Promise.resolve(QueryUsersInfo(db, userRequiredInfo))
            .then(userInfos => {
                Send.Ok(res, userInfos, action)
            })
            .catch(ex => {
                Send.Error(res, `Houve um erro ao listar as informações requeridas dos usuários. Erro: ${ ex.message }`, action)
            })
    }
    catch (ex)
    {
        Send.Error(res, `Houve um erro ao listar as informações requeridas dos usuários. Erro: ${ (ex as Error).message }`, action)
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

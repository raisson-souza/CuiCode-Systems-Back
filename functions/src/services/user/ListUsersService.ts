import {
    Request,
    Response,
} from "firebase-functions"

import IsUndNull from "../../functions/IsUndNull"
import Send from "../../functions/Responses"

import QueryUsersInfos from "./utilities/QueryUsersInfos"

/**
 * Queries specific information about all users.
 * @param req requiredInfos = {Part of User object}
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

        const userRequiredInfos = CheckQuery(req.query)

        await Promise.resolve(QueryUsersInfos(db, userRequiredInfos))
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
    if (IsUndNull(query.RequiredInfos))
        throw new Error("Informações requeridas dos usuários não encontradas na URL.")

    const JsonConvertedQuery = JSON.parse(query.RequiredInfos)

    const RequiredInfosArray = new Array(JsonConvertedQuery)

    return RequiredInfosArray[0]
}

import {
    Request,
    Response,
} from "firebase-functions"

import IsUndNull from "../../functions/IsUndNull"
import Send from "../../functions/Responses"

import QueryUsersInfos from "./utilities/QueryUsersInfos"

/**
 * Queries specific information about all users.
 * Aproved 31/07.
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
        const userRequiredInfos = CheckBody(req.body)

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

function CheckBody(body : any) : Array<string>
{
    if (IsUndNull(body.requiredInfos))
        throw new Error("Informações requeridas dos usuários não encontradas no corpo da requisição.")

    return body.requiredInfos
}

import {
    Request,
    Response,
} from "firebase-functions"

import QueryUser from "./utilities/QueryUser"

import IsUndNull from "../../functions/IsUndNull"
import Send from "../../functions/Responses"

/**
 * Queries a user.
 * @param req User ID
 * @param res 
 * @param db 
 */
export default async function GetUserService
(
    req : Request,
    res : Response,
    db : any
)
: Promise<void>
{
    const action = "Consulta de usuário."
    try
    {
        if (req.method != "GET")
            return Send.MethodNotAllowed(res, "Método não autorizado.", action)

        const userId = CheckBody(req.body)

        await Promise.resolve(QueryUser(db, userId))
            .then(user => {
                Send.Ok(res, user, action)
            })
            .catch(ex => {
                Send.Error(res, `Houve um erro ao consultar o usuário de ID ${ userId }. Erro: ${ ex.message }`, action)
            })
    }
    catch (ex)
    {
        Send.Error(res, `Houve um erro ao consultar o usuário. Erro: ${ (ex as Error).message }`, action)
    }
}

function CheckBody(body : any) : number
{
    if (IsUndNull(body.Id))
        throw new Error("Id de usuário não encontrado no corpo da requisição.");

    if (body.Id < 0)
        throw new Error("Id de usuário inválido.");

    return body.Id
}

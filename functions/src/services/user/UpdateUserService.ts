import {
    Request,
    Response,
} from "firebase-functions"

import User from "../../classes/User"

import ValidateUser from "./utilities/ValidateUser"
import SetUser from "./utilities/SetUser"

import Send from "../../functions/Responses"
import FormatIdNumber from "../../functions/FormatIdNumber"

// FIXING
// Receber o ID do user e os parametros a serem editados apenas

/*
UserId : number,
UserInfoUpdate: {
    ...User
}
*/

/**
 * Updates a user.
 * Aproved 02/08.
 * @param req User object
 * @param res 
 * @param db 
 * @param admin 
 */
export default async function UpdateUserService
(
    req : Request,
    res : Response,
    db : any,
    admin : any,
)
: Promise<void>
{
    const action = "Edição de usuário"
    try
    {
        if (req.method != "PUT")
            return Send.MethodNotAllowed(res, "Método não autorizado.", action)

        const user = CheckBody(req.body)
        const userKey = `${ user.Username }#${ FormatIdNumber(user.Id) }`

        await Promise.resolve(ValidateUser(db, user, false))
            .then(async () => {
                await Promise.resolve(SetUser(admin, user))
                    .then(() => {
                        Send.Ok(res, `Usuário ${ userKey } editado com sucesso.`, action)
                    })
                    .catch(ex => {
                        Send.Error(res, `Houve um erro ao editar o usuário ${ userKey }. Erro: ${ ex.message }`, action)
                    })
            })
            .catch(ex => {
                Send.Error(res, `Houve um erro ao editar o usuário ${ userKey }. Erro: ${ ex.message }`, action)
            })
    }
    catch (ex)
    {
        Send.Error(res, `Houve um erro ao editar o usuário. Erro: ${ (ex as Error).message }`, action)
    }
}

function CheckBody(body : Object) : User
{
    return new User(body)
}

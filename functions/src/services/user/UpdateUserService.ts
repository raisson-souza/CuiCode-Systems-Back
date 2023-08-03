import {
    Request,
    Response,
} from "firebase-functions"

import User from "../../classes/User"

import ValidateUser from "./utilities/ValidateUser"
import SetUser from "./utilities/SetUser"

import Send from "../../functions/Responses"
import IsUndNull from "../../functions/IsUndNull"

/**
 * Updates a user.
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
    dbRef : string,
)
: Promise<void> 
{
    const action = "Edição de usuário"
    try
    {
        if (req.method != "PUT")
            return Send.MethodNotAllowed(res, "Método não autorizado.", action)

        const user = CheckBody(req.body)
        const userKey = user.GenerateUserKey()

        await Promise.resolve(ValidateUser(db, user, false))
            .then(async () => {

                await Promise.resolve(SetUser(admin, user, db, dbRef))
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

function CheckBody(body : any) : User
{
    if (IsUndNull(body))
        throw new Error("Corpo da requisição inválido.");

    const user = new User(body, true);

    if (IsUndNull(user.Id))
        throw new Error("Id de usuário a ser atualizado não encontrado.");

    return user
}

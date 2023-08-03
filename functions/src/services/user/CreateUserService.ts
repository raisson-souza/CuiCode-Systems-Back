import {
    Request,
    Response,
} from "firebase-functions"

import User from "../../classes/User"

import ValidateUser from "./utilities/ValidateUser"
import SetUser from "./utilities/SetUser"

import Send from "../../functions/Responses"

/**
 * Creates a user.
 * Aproved 02/08.
 * @param req User Object
 * @param res 
 * @param db 
 * @param admin 
 */
export default async function CreateUserService
(
    req : Request,
    res : Response,
    db : any,
    admin : any,
)
: Promise<void>
{
    const action = "Criação de usuário"

    try
    {
        if (req.method != "POST")
            return Send.MethodNotAllowed(res, "Método não autorizado.", action)

        const user = CheckBody(req.body)

        User.ValidateUsername(user.Username)
        user.FormatUsername()

        await Promise.resolve(ValidateUser(db, user))
            .then(async () => {
                await Promise.resolve(
                    SetUser(admin, user, db)
                )
                .then(() => {
                    Send.Created(res, "Usuário criado com sucesso.", action)
                })
                .catch(ex => {
                    Send.Error(res, `Houve um erro ao criar o usuário. Erro: ${ ex.message }`, action)
                })
            })
            .catch(ex => {
                Send.Error(res, `Houve um erro ao criar o usuário. Erro: ${ ex.message }`, action)
            })
    }
    catch (ex)
    {
        Send.Error(res, `Houve um erro ao criar o usuário. Erro: ${ (ex as Error).message }`, action)
    }
}

function CheckBody(body : any) : User
{
    return new User(body)
}

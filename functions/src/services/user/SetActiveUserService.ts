import {
    Request,
    Response,
} from "firebase-functions"

import IsUndNull from "../../functions/IsUndNull"
import IsBoolean from "../../functions/IsBoolean"
import Send from "../../functions/Responses"

import QueryUser from "./utilities/QueryUser"
import SetUser from "./utilities/SetUser"

/**
 * Sets active param of a user.
 * Aproved 02/08.
 * @param req User ID and isActive
 * @param res 
 * @param db 
 * @param admin 
 */
export default async function SetActiveUserService
(
    req : Request,
    res : Response,
    db : any,
    admin : any,
)
: Promise<void>
{
    const action = "Desativação ou ativação de usuário"

    try
    {
        if (req.method != "PUT")
            return Send.MethodNotAllowed(res, "Método não autorizado.", action)

        const bodyChecked = CheckBody(req.body)
        const {
            userId,
            isActive
        } = bodyChecked

        const renderAction = isActive ? "desativar" : "ativar"
        const renderVerbalAction = isActive ? "desativado" : "ativado"

        await Promise.resolve(QueryUser(db, userId))
            .then(async (user) => {
                user.Active = isActive
                
                await Promise.resolve(SetUser(admin, user, db))
                    .then(() => {
                        Send.Ok(res, `Usuário de ID ${ userId } ${ renderVerbalAction } com sucesso.`, action)
                    })
                    .catch(ex => {
                        Send.Error(res, `Houve um erro ao ${ renderAction } o usuário: ${ ex.message }`, action)
                    })
            })
            .catch(ex => {
                Send.Error(res, `Houve um erro ao ${ renderAction } o usuário: ${ ex.message }`, action)
            })
    }
    catch (ex)
    {
        Send.Error(res, `Houve um erro ao desativar ou ativar o usuário: ${ (ex as Error).message }`, action)
    }
}

function CheckBody(body : any) : { userId : number, isActive : boolean }
{
    if (IsUndNull(body.Id) || IsUndNull(body.isActive)) 
        throw new Error("Id de usuário não encontrado no corpo da requisição.")

    if (body.Id < 0)
        throw new Error("Id de usuário inválido.")

    if (!IsBoolean(body.isActive))
        throw new Error("Parâmetro de ativação inválido.")

    return {
        userId: body.Id,
        isActive: body.isActive
    }
}

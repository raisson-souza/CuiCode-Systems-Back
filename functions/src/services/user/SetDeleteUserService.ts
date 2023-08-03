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
 * Sets deleted param of a user;
 * Aproved 02/08.
 * @param req User ID and isDeleted
 * @param res 
 * @param db 
 * @param admin 
 */
export default async function SetDeleteUserService
(
    req : Request,
    res : Response,
    db : any,
    admin : any,
)
: Promise<void>
{
    const action = "Exclusão ou restauração de usuário"

    try
    {
        if (req.method != "DELETE")
            return Send.MethodNotAllowed(res, "Método não autorizado.", action)

        const bodyChecked = CheckBody(req.body)
        const {
            userId,
            isDelete
        } = bodyChecked

        const renderAction = isDelete ? "deletar" : "restaurar"
        const renderVerbalAction = isDelete ? "deletado" : "restaurado"

        await Promise.resolve(QueryUser(db, userId))
            .then(async (user) => {
                user.Deleted = isDelete
                
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
        Send.Error(res, `Houve um erro ao deletar ou restaurar o usuário: ${ (ex as Error).message }`, action)
    }
}

function CheckBody(body : any) : { userId : number, isDelete : boolean }
{
    if (IsUndNull(body.Id) || IsUndNull(body.isDelete)) 
        throw new Error("Id de usuário não encontrado no corpo da requisição.")

    if (body.Id < 0)
        throw new Error("Id de usuário inválido.")

    if (!IsBoolean(body.isDelete))
        throw new Error("Parâmetro de exclusão inválido.")

    return {
        userId: body.Id,
        isDelete: body.isDelete
    }
}

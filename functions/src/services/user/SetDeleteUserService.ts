import IsUndNull from "../../functions/IsUndNull"
import IsBoolean from "../../functions/IsBoolean"
import Send from "../../functions/Responses"

import QueryUser from "./utilities/QueryUser"
// import SetUser from "./utilities/SetUser"
import Service from "../../classes/Service"

/**
 * Sets deleted param of a user;
 */
export default async function SetDeleteUserService
(
    service : Service
)
: Promise<void>
{
    const action = "Exclusão ou restauração de usuário"

    try
    {
        const {
            REQ,
            RES,
            DB_connection,
            DB_stage
        } = service

        if (REQ.method != "DELETE")
            return Send.MethodNotAllowed(RES, "Método não autorizado.", action)

        const bodyChecked = CheckBody(REQ.body)
        const {
            userId,
            isDelete
        } = bodyChecked

        const renderAction = isDelete ? "deletar" : "restaurar"
        const renderVerbalAction = isDelete ? "deletado" : "restaurado"

        // CORRIGIR
    }
    catch (ex)
    {
        Send.Error(service.RES, `Houve um erro ao deletar ou restaurar o usuário: ${ (ex as Error).message }`, action)
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

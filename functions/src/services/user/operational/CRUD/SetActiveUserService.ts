import IsUndNull from "../../../../functions/IsUndNull"
import IsBoolean from "../../../../functions/IsBoolean"
import Send from "../../../../functions/Responses"

import QueryUser from "../../utilities/QueryUser"
// import SetUser from "./utilities/SetUser"
import Service from "../../../../classes/Service"

/**
 * Sets active param of a user.
 */
export default async function SetActiveUserService
(
    service : Service
)
: Promise<void>
{
    const action = "Desativação ou ativação de usuário"

    try
    {
        const {
            REQ,
            RES,
            DB_connection,
            DB_stage
        } = service

        if (REQ.method != "PUT")
            return Send.MethodNotAllowed(RES, "Método não autorizado.", action)

        const bodyChecked = CheckBody(REQ.body)

        const {
            userId,
            isActive
        } = bodyChecked

        const renderAction = isActive ? "desativar" : "ativar"
        const renderVerbalAction = isActive ? "desativado" : "ativado"

        // CORRIGIR
    }
    catch (ex)
    {
        Send.Error(service.RES, `Houve um erro ao desativar ou ativar o usuário: ${ (ex as Error).message }`, action)
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

import Service from "../../../../classes/Service"

import Send from "../../../../functions/Responses"

import SendApprovalEmailOperation from "./SendApprovalUserEmailOperation"

export default async function SendManualEmailApprovalService
(
    service : Service
)
: Promise<void>
{
    const action = "Envio manual de aprovação de email de usuário"

    try
    {
        const {
            REQ,
            RES,
            DB_connection,
            DB_stage,
        } = service

        if (REQ.method != "POST")
            return Send.MethodNotAllowed(RES, "Método não autorizado.", action)

        await service.SetReqUserAsync()

        // O email a ser aprovado já está no UserReq

        await Promise.resolve(SendApprovalEmailOperation(service.USER_req!, DB_stage, DB_connection))
            .then(() => {
                Send.Ok(RES, "Solicitação de aprovação de email realizada com sucesso.", action)
            })
            .catch(ex => {
                throw new Error(ex.message)
            })
    }
    catch (ex)
    {
        Send.Error(service.RES, `Houve um erro ao realizar a solicitação de aprovação de email. Erro: ${ (ex as Error).message }`, action)
    }
    finally
    {
        service.DB_connection.end()
    }
}

import Service from "../../../../classes/Service"

import Send from "../../../../functions/Responses"

import SendApprovalEmailOperation from "./SendApprovalUserEmailOperation"

export default class SendManualEmailApprovalService extends Service
{
    Action = "Envio manual de aprovação de email de usuário"

    async Operation()
    {
        try
        {
            const {
                RES,
                DB_connection,
                Action
            } = this

            await this.SetReqUserAsync()

            // O email a ser aprovado já está no UserReq

            await Promise.resolve(new SendApprovalEmailOperation(this.USER_req!, DB_connection).PerformOperation())
                .then(() => {
                    Send.Ok(RES, "Solicitação de aprovação de email realizada com sucesso.", Action)
                })
                .catch(ex => {
                    throw new Error(ex.message)
                })
        }
        catch (ex)
        {
            Send.Error(this.RES, `Houve um erro ao realizar a solicitação de aprovação de email. Erro: ${ (ex as Error).message }`, this.Action)
        }
        finally
        {
            this.DB_connection.end()
        }
    }
}

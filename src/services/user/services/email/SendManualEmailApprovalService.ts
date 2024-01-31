import SendApprovalEmailOperation from "./SendApprovalUserEmailOperation"

import ClientService from "../../../../classes/service/ClientService"
import ResponseMessage from "../../../../classes/DTOs/ResponseMessage"

import HttpStatusEnum from "../../../../enums/system/HttpStatusEnum"

class SendManualEmailApprovalService extends ClientService
{
    Action = "Envio manual de aprovação de email de usuário."

    CheckQuery() { throw new Error("Method not implemented.") }

    CheckBody() { throw new Error("Method not implemented.") }

    async Operation()
    {
        try
        {
            const {
                RES,
                DB_connection,
                Action
            } = this

            await this.AuthenticateRequestor()

            // O email a ser aprovado já está no UserAuthId

            await Promise.resolve(new SendApprovalEmailOperation(this.USER_auth!, DB_connection).PerformOperation())
                .then(() => {
                    ResponseMessage.Send(
                        HttpStatusEnum.ACCEPTED,
                        "Solicitação de aprovação de email realizada com sucesso.",
                        Action,
                        RES
                    )
                })
                .catch(ex => {
                    throw new Error((ex as Error).message)
                })
        }
        catch (ex)
        {
            ResponseMessage.Send(
                HttpStatusEnum.INTERNAL_SERVER_ERROR,
                `Houve um erro ao realizar a solicitação de aprovação de email. Erro: ${ (ex as Error).message }`,
                this.Action,
                this.RES
            )
        }
        finally
        {
            this.DB_connection.end()
        }
    }
}

export default SendManualEmailApprovalService
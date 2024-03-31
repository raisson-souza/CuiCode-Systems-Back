import SendApprovalEmailOperation from "./SendApprovalUserEmailOperation"

import ClientService from "../../../../classes/service/ClientService"
import Exception from "../../../../classes/custom/Exception"
import ResponseMessage from "../../../../classes/system/ResponseMessage"

import HttpStatusEnum from "../../../../enums/system/HttpStatusEnum"

/**
 * Envio manual de aprovação de email.
 */
class SendManualEmailApprovalService extends ClientService
{
    Action = "Envio manual de aprovação de email de usuário."

    CheckQuery() { throw new Error("Method not implemented.") }

    CheckBody() { throw new Error("Method not implemented.") }

    CheckParams() { }

    async Operation()
    {
        try
        {
            const {
                DB_connection,
            } = this

            await this.AuthenticateRequestor()

            // O email a ser aprovado já está no UserAuthId

            await Promise.resolve(new SendApprovalEmailOperation(this.USER_auth!, DB_connection).PerformOperation())
                .then(() => {
                    ResponseMessage.Send({
                        status: HttpStatusEnum.ACCEPTED,
                        data: "Solicitação de aprovação de email realizada com sucesso.",
                        log: this.Action,
                        expressResponse: this.RES
                    })
                })
                .catch(ex => {
                    throw new Error((ex as Error).message)
                })
        }
        catch (ex)
        {
            ResponseMessage.Send({
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR,
                data: `Houve um erro ao realizar a solicitação de aprovação de email. Erro: ${ (ex as Error).message }`,
                log: this.Action,
                expressResponse: this.RES
            })
            Exception.UnexpectedError((ex as Error).message, this.Action)
        }
        finally
        {
            this.DB_connection.end()
        }
    }
}

export default SendManualEmailApprovalService
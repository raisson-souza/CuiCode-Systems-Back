import ServerService from "../../classes/service/ServerService"

import EmailSender from "../../classes/entities/email/EmailSender"
import Exception from "../../classes/custom/Exception"
import ResponseMessage from "../../classes/system/ResponseMessage"

import EmailTitlesEnum from "../../enums/EmailTitlesEnum"
import HttpStatusEnum from "../../enums/system/HttpStatusEnum"

class TraceAccessService extends ServerService
{
    Action : string = "Rastreio de Ação de Usuário."

    CheckBody() { return this.REQ.body }

    CheckQuery() { throw new Error("Method not implemented.") }

    Operation()
    {
        try
        {
            this.AuthenticateRequestor()

            const emailBody = this.CheckBody()

            EmailSender.Internal(
                EmailTitlesEnum.TRACE_ACTION,
                JSON.stringify(emailBody)
            )

            ResponseMessage.Send(
                HttpStatusEnum.ACCEPTED,
                "Ação de rastreio realizada com sucesso.",
                this.Action,
                this.RES
            )
        }
        catch (ex)
        {
            ResponseMessage.Send(
                HttpStatusEnum.INTERNAL_SERVER_ERROR,
                `Houve um erro no envio do email. Erro: ${ (ex as Error).message }`,
                this.Action,
                this.RES
            )
            Exception.UnexpectedError((ex as Error).message, this.Action)
        }
    }
}

export default TraceAccessService
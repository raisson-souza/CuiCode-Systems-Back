import ServerService from "../../classes/service/ServerService"

import EmailSender from "../../classes/entities/email/EmailSender"
import Send from "../../functions/system/Send"

import EmailTitlesEnum from "../../enums/EmailTitlesEnum"

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

            Send.Ok(this.RES, "Ação de rastreio realizada com sucesso.", this.Action)
        }
        catch (ex)
        {
            Send.Error(this.RES, `Houve um erro no envio do email. Erro: ${ (ex as Error).message }`, "Envio de e-mail")
        }
    }
}

export default TraceAccessService
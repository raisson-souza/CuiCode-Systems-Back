import Service from "../../classes/Service"

import Send from "../../functions/Responses"
import EmailSender from "../../functions/system/EmailSender"

import EmailTitlesEnum from "../../enums/EmailTitlesEnum"

class TraceAccessService extends Service
{
    Action : string = "Rastreio de Ação de Usuário."

    CheckBody()
    {
        return this.REQ.body
    }

    Operation()
    {
        try
        {
            const emailBody = this.CheckBody()

            new EmailSender()
                .Internal(
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
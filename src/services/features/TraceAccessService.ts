const nodemailer = require('nodemailer');

import Service from "../../classes/Service"

import Send from "../../functions/Responses"
import GetDate from "../../functions/GetDate"

export default class TraceAccessService extends Service
{
    Action : string = "Rastreio de Ação de Usuário"

    Operation()
    {
        try
        {
            const body = this.REQ.body

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'raisson.testes@gmail.com',
                    pass: 'evne uzxd elkq tgyn'
                }
            });

            const date = GetDate()

            let mailOptions = {
                from: "Server",
                to: 'raissonrai@gmail.com',
                subject: `CuiCode Systems TraceAccessService (${ date })`,
                text: "text",
                html: JSON.stringify(body)
            };

            transporter.sendMail(mailOptions)
                .then(() => {
                    Send.Ok(this.RES, "Email enviado.", "Envio de e-mail")
                })
                .catch((ex: { message: any }) => {
                    Send.Error(this.RES, `Houve um erro no envio do email. Erro: ${ ex.message }`, "Envio de e-mail")
                })
        }
        catch (ex)
        {
            Send.Error(this.RES, `Houve um erro no envio do email. Erro: ${ (ex as Error).message }`, "Envio de e-mail")
        }
    }
}
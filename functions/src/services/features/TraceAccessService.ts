import {
    Request,
    Response,
} from "firebase-functions"

const nodemailer = require('nodemailer');

import Send from "../../functions/Responses"
import GetDate from "../../functions/GetDate";
import ValidateMethod from "../../functions/ValidateMethod";

export default async function TraceAccessService
(
    req : Request,
    res : Response,
)
: Promise<void>
{
    try
    {
        const body = req.body

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
                Send.Ok(res, "Email enviado.", "Envio de e-mail")
            })
            .catch((ex: { message: any }) => {
                Send.Error(res, `Houve um erro no envio do email. Erro: ${ ex.message }`, "Envio de e-mail")
            })
    }
    catch (ex)
    {
        Send.Error(res, `Houve um erro no envio do email. Erro: ${ (ex as Error).message }`, "Envio de e-mail")
    }
}

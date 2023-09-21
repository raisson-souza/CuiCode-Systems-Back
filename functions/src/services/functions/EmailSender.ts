import nodemailer from "nodemailer"

import CaseUndNull from "../../functions/CaseUndNull"
import EmailTitles from "../../enums/EmailTitles"

export default class EmailSender
{
    Transporter = nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: 'raisson.testes@gmail.com',
                pass: 'evne uzxd elkq tgyn'
            }
        }
    )

    Internal
    (
        title : EmailTitles,
        emailBody : string | null = null
    )
    {
        this.Transporter.sendMail(
            this.BuildEmailTransporter(
                title,
                emailBody
            )
        )
    }

    External
    (
        title : EmailTitles,
        emailBody : string | null = null,
        receiverEmail : string | null = null
    )
    {
        this.Transporter.sendMail(
            this.BuildEmailTransporter(
                title,
                emailBody,
                receiverEmail
            )
        )
    }

    private BuildEmailTransporter
    (
        title : EmailTitles,
        emailBody : string | null = null,
        receiverEmail : string | null = null,
    )
    {
        return {
            from: "CuiCodeSystems",
            to: CaseUndNull(receiverEmail, "raisson.testes@gmail.com"),
            subject: `CuiCodeSystems - ${ title }`,
            text: CaseUndNull(emailBody, ""),
            html: ""
        }
    }
}

import nodemailer from "nodemailer"

import CaseUndNull from "../../../functions/logic/CaseUndNull"

import EmailTitles from "../../../enums/EmailTitlesEnum"

abstract class EmailSender
{
    private static Transporter = nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: 'raisson.testes@gmail.com',
                pass: 'evne uzxd elkq tgyn'
            }
        }
    )

    static Internal
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

    static External
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

    private static BuildEmailTransporter
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

export default EmailSender
import nodemailer from "nodemailer"

import HermesTitle from "../../enums/HermesTitle"

import CaseUndNull from "../../functions/CaseUndNull"

export default class HERMES
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

    SendInternalEmail
    (
        title : HermesTitle,
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

    SendExternalEmail
    (
        title : HermesTitle,
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
        title : HermesTitle,
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

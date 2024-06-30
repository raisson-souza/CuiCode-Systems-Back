import nodemailer from "nodemailer"

import Env from "../../../config/Env"

import CaseUndNull from "../../../functions/logic/CaseUndNull"

import EmailTitles from "../../../enums/EmailTitlesEnum"

const emailSenderConfig = Env.EmailSenderConfig()

abstract class EmailSender
{
    private static Transporter = nodemailer.createTransport(
        {
            service: emailSenderConfig.emailService,
            auth: {
                user: emailSenderConfig.email,
                pass: emailSenderConfig.password
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
            to: CaseUndNull(receiverEmail, emailSenderConfig.receiverEmail),
            subject: `CuiCodeSystems - ${ title }`,
            text: CaseUndNull(emailBody, ""),
            html: ""
        }
    }
}

export default EmailSender
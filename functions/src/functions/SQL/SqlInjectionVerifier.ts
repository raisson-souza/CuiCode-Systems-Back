import EmailSender from "../system/EmailSender"

import EmailTitles from "../../enums/EmailTitlesEnum"

/**
 * Validates SQL injection risk in a query parameter.
 */
export default function SqlInjectionVerifier(param : string)
{
    if (param.toUpperCase().includes("OR"))
    {
        new EmailSender().Internal(EmailTitles.SYSTEM_RISK, `Risco de SQL injection detectado, SQL: ${ param }`)
        throw new Error("Injeção de SQL verificada, operação interrompida.")
    }
}

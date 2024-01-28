import EmailSender from "../../classes/entities/email/EmailSender"

import EmailTitles from "../../enums/EmailTitlesEnum"

/**
 * Validates SQL injection risk in a query parameter.
 */
function SqlInjectionVerifier(param : string)
{
    if (param.toUpperCase().includes("OR"))
    {
        EmailSender.Internal(EmailTitles.SYSTEM_RISK, `Risco de SQL injection detectado, SQL: ${ param }`)
        throw new Error("Injeção de SQL verificada, operação interrompida.")
    }
}

export default SqlInjectionVerifier
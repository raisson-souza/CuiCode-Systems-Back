import EmailTitles from "../../enums/EmailTitlesEnum"
import EmailSender from "../../services/functions/EmailSender"

/**
 * Validates SQL injection risk in a query parameter.
 * @param param 
 */
export default function SqlInjectionVerifier(param : string)
{
    if (param.toUpperCase().includes("OR"))
    {
        new EmailSender().Internal(EmailTitles.SYSTEM_RISK, `Risco de SQL injection detectado, SQL: ${ param }`)
        throw new Error("Injeção de SQL verificada, operação interrompida.")
    }
}
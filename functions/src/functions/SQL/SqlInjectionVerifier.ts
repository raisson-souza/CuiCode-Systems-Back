import HermesTitle from "../../enums/HermesTitle"
import HERMES from "../../services/functions/HERMES"

/**
 * Validates SQL injection risk in a query parameter.
 * @param param 
 */
export default function SqlInjectionVerifier(param : string)
{
    if (param.toUpperCase().includes("OR"))
    {
        new HERMES().SendInternalEmail(HermesTitle.SYSTEM_RISK, `Risco de SQL injection detectado, SQL: ${ param }`)
        throw new Error("Injeção de SQL verificada, operação interrompida.")
    }
}
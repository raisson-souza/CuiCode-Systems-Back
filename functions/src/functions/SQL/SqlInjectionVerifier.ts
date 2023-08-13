/**
 * Validates SQL injection risk in a query parameter.
 * @param param 
 */
export default function SqlInjectionVerifier(param : string)
{
    if (param.toLowerCase().includes("OR"))
        throw new Error("Injeção de SQL verificada, operação interrompida.")

    // send email
}
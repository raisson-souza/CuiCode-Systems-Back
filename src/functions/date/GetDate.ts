/**
 * Retorna a data local.
 */
export default function GetDate() : string
{
    return new Date().toLocaleString('pt-BR', { timeZone: "America/Sao_Paulo" })
}
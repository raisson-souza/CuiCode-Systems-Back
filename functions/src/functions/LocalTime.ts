export default function GetDate() : string
{
    const date = new Date()

    return date.toLocaleString('pt-BR', { timeZone: "America/Sao_Paulo" })
}
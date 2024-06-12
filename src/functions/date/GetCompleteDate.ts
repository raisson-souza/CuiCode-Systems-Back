type GetDateReturn = {
    day : string
    month : string
    year : string
    hour : string
    minute : string
    second : string
    completeDate : string
}

/**
 * Busca a data local.
 */
export default function GetCompleteDate() : GetDateReturn
{
    const date = new Date().toLocaleString('pt-BR', { timeZone: "America/Sao_Paulo" })

    return {
        day: date.split(', ')[0].split('/')[0],
        month: date.split(', ')[0].split('/')[1],
        year: date.split(', ')[0].split('/')[2],
        hour: date.split(', ')[1].split(':')[0],
        minute: date.split(', ')[1].split(':')[1],
        second: date.split(', ')[1].split(':')[2],
        completeDate: date.replace(',', '')
    }
}
// EERRADO
export default function GetDate() : string
{
    const date = new Date().setUTCDate(-3)

    return new Date(date).toString()
}
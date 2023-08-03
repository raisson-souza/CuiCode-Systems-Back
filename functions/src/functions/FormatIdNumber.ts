export default function FormatIdNumber(id: number) : string
{
    const stringId = id.toString()

    switch (stringId.length)
    {
        case 1:
            return `00${ stringId }`
        case 2:
            return `0${ stringId }`
        case 3:
            return stringId
        default:
            return stringId
    }
}
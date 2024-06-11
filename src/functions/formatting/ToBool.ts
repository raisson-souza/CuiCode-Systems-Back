/** Tranforma um valor em booleano */
export default function ToBool(value : any) : boolean
{
    if (value === true)
        return true
    else if (value === false)
        return false
    else if (value instanceof String)
    {
        if (
            value === "true" ||
            value === "True" ||
            value === "1"
        )
            return true
        else if (
            value === "false" ||
            value === "False" ||
            value === "0"
        )
            return false
        else
            return false
    }
    else if (value instanceof Number)
        return value as number >= 1
    else
        return false
}
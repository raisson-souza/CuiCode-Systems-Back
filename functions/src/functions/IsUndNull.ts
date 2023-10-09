/**
 * Validates if a param is undefined or null
 */
export default function IsUndNull(param : any) : boolean
{
    if (param == undefined || param == null)
        return true

    if (typeof param == "string")
    {
        if ((param as string).trim() == "" || param == "null" || param == "undefined")
            return true
    }

    return false
}

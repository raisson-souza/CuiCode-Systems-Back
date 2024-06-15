/**
 * Valida se o parâmetro PARAM é nulo ou indefinido.
 */
function IsNil(param : any) : boolean
{
    if (param === undefined || param === null)
        return true

    if (typeof param == "string")
    {
        if ((param as string).trim() == "" || param == "null" || param == "undefined")
            return true
    }

    if (Number.isNaN(param))
        return true

    return false
}

export default IsNil
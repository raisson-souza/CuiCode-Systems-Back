import IsUndNull from "./IsUndNull"

/**
 * Retorna o primeiro valor das chaves oferecidas a função em relação a um objeto.
 * @param body Object / JSON
 * @param keys Keys of a object
 * @returns 
 */
function FindValue
(
    body : any,
    keys : string[]
) : any | null
{
    let value : any = null

    keys.every(key => {
        if (!IsUndNull(body[key]))
        {
            value = body[key]
            return false
        }
        return true
    })

    return value
}

export default FindValue
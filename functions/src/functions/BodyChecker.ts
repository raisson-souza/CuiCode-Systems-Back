/**
 * Checks all params of a body for a process.
 * @param body 
 * @param params 
 */
export default function BodyChecker(body : Object, params : string[]) : void
{
    let c : number = 0

    Object.keys(body).forEach(param => {
        if (params.includes(param)) c++
    })

    if (c < params.length)
        throw new Error('O objeto não contém todos os parâmetros.')
}

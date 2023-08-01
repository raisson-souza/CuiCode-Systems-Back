function BodyChecker(body : Object, params : string[]) : void
{
    let c : number = 0

    Object.keys(body).forEach(param => {
        if (params.includes(param)) c++
    })

    if (c < params.length)
        throw new Error('O objeto não contém todos os parâmetros.')
}

// function NewBodyChecker
// (
//     body : Object,
//     params : Array<string>
// )
// : void
// {
//     let c = 0

//     Object.keys(body).forEach(param => {
//         if (params.includes(param)) c++
//     })

//     if (c < params.length)
//         throw new Error('O corpo da requisição não contém todos os parâmetros requeridos.')
// }

export default BodyChecker

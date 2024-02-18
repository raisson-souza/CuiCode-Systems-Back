function ParseSqlArrayParams
(
    params : string[],
    delimiter : string = ', '
)
{
    let str = ''

    params.forEach((param, i) => {
        str += `${ param }${ i === params.length - 1 ? "" : delimiter }`
    })

    return str
}  

export default ParseSqlArrayParams
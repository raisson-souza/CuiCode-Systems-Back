function FormatZeros(num : number, strLen : number)
{
    const numLen = String(num).length
    let str = ''

    for (let i = numLen; i < strLen; i++)
    {
        str += '0'
    }

    return `${ str }${ num }`
}

export default FormatZeros
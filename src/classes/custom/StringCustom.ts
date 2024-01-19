class StringCustom extends String
{
    static fillZeros(str : any, len : number = 2)
    {
        const strFormatted = String(str)
        const multiplier = len - strFormatted.length
        let zeros = ""
        for (let i = 0; i < multiplier; i++) { zeros += "0" }
        return `${ zeros }${ strFormatted }`
    }
}

export default StringCustom
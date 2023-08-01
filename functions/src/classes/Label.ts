class Label
{
    Description: string
    Value: number

    constructor
    (
        enumParam : any,
        enumValue : number,
        enumName : string,
    )
    {
        const decodedEnum = DecodeEnum(enumParam, enumValue, enumName)

        this.Description = decodedEnum.Description,
        this.Value = decodedEnum.Value
    }
}

function DecodeEnum<T extends Record<string, number>>
(
    enumParam: T,
    enumValue: number,
    enumName: string,
)
:
{ 
    Description: string
    Value: number
}
{
    const chaveEnum = String(enumValue)

    if (enumParam[chaveEnum] !== undefined)
        return {
            Description: String(enumParam[chaveEnum]),
            Value: enumValue
        }
    
    throw new Error(`Houve um erro ao converter o enumerador ${ enumName }. Valor ${ enumValue } não existe.`)
}

export default Label

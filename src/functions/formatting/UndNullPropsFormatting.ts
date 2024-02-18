import IsUndNull from "../logic/IsUndNull"

function UndNullPropsFormatting(props : any)
{
    const obj : any = {}

    Object.entries(props).forEach(prop => {
        if (!IsUndNull(prop[1]))
            obj[prop[0]] = prop[1]
    })

    return obj
}

export default UndNullPropsFormatting
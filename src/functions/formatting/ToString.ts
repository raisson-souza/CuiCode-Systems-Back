export default function ToString(value : string | number) : string
{
    if (
        value === "null" ||
        value === "undefined" ||
        value === "NaN"
    )
        return ""
    else if (typeof value === "number") return `${ value }`
    else return String(value)
}
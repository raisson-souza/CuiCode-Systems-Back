import IsNil from "../logic/IsNil"

/** Parseia um objeto em string JSON, pode ignorar valores nulos. */
export default function StringifyJSON(json : any, ignoreNilValues : boolean = true) : string
{
    return JSON.stringify(
        json,
        (_, value) => {
            if (ignoreNilValues)
                if (ignoreNilValues && !IsNil(value)) return value
        }
    )
}
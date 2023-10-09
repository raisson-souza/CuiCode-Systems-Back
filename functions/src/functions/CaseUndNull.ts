import IsUndNull from "./IsUndNull"

/**
 * Checks if the first argument is null or undefined.
 * If true, returns the second argument,
 * If false, returns the first argument
 */
export default function CaseUndNull(param1 : any, param2 : any)
{
    return IsUndNull(param1)
        ? param2
        : param1
}

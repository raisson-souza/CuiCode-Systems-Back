import IsNil from "./IsNil"

type AreNilProps = {
    params : any[]
    allNil? : boolean
}

/**
 * Verifica se todos ou pelo menos um dos PARAMS são nulos ou indefinidos
 */
export default function AreNil({
    params,
    allNil = true
} : AreNilProps) {
    let nilResults = 0

    params.forEach(param => {
        if (IsNil(param)) nilResults++
    })

    return allNil
        ? nilResults === params.length
        : nilResults > 0
}
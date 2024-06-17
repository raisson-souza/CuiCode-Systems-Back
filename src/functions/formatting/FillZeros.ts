import ToString from "./ToString"

/**
 * Função que recebe uma string de um número e completa com zeros a esquerda de acordo com o necessário.
 */
export default function FillZeros(str : string | number, len : number = 2) : string
{
    if (typeof str === 'number') str = ToString(str)
    const multiplier = len - str.length
    for (let i = 0; i < multiplier; i++) { str += "0" }
    return str
}
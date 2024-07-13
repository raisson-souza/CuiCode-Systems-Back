/**
 * Extrai o JWT da requisição.
 */
export default function JwtParser(jwt : string)
{
    if (jwt.includes("Bearer "))
        return jwt.split(" ")[1]

    return jwt
}
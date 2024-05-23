import { verify } from "jsonwebtoken"

import env from "../../config/Env"

function IsJwtExpired(token : string)
{
    const decoded = verify(
        token,
        env.JwtSecret(),
        { ignoreExpiration: true }
    )

    const timeNow = new Date().getTime() / 1000

    const expirationTime = (decoded as any)["exp"]

    return timeNow >= expirationTime
}

export default IsJwtExpired
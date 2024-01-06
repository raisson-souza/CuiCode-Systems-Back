import { verify } from "jsonwebtoken"
import { Request } from "express"

import Env from "../../config/environment"

import IsUndNull from "../IsUndNull"

function ExtractToken
(
    req : Request
)
{
    const { authorization } = req.headers

    if (IsUndNull(authorization))
        throw new Error("Header de autorização vazio.")

    const token = authorization?.split(" ")[1]!
    const decoded = verify(token, Env.JWT_key)

    return decoded as any
}

export default ExtractToken
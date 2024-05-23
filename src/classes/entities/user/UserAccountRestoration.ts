import { Client } from "pg"
import { sign, verify } from "jsonwebtoken"

import env from "../../../config/Env"

import EntityBasic from "../base/EntityBasic"
import User from "./User"
import UserBase from "../../bases/UserBase"

import IEntityWithForeignKey from "../../../interfaces/IEntityWithForeignKey"

import FindValue from "../../../functions/logic/FindValue"
import IsJwtExpired from "../../../functions/math/IsTimeExpired"
import IsUndNull from "../../../functions/logic/IsUndNull"

class UserAccountRestoration extends EntityBasic implements IEntityWithForeignKey
{
    Completed : Boolean
    Created : Date
    Expired : Boolean
    Jwt : string | null
    User : User | null
    UserEmail : string
    UserId : number

    constructor(body : any)
    {
        super(body)
        this.ConvertBody(body)
        this.DecodeJwt(FindValue(body, ["Jwt", "jwt"]))
    }

    ConvertBody(body: any)
    {
        this.Completed = FindValue(body, ["Completed", "completed"])
        this.Created = FindValue(body, ["Created", "created"])
        this.Expired = FindValue(body, ["Expired", "expired"])
        this.Jwt = FindValue(body, ["Jwt", "jwt"])
        this.UserEmail = FindValue(body, ["UserEmail", "user_email"])
        this.UserId = FindValue(body, ["UserId", "user_id"])
    }

    ConvertToSqlObject()
    {
        return {
            "id": this.Id,
            "completed": this.Completed,
            "created": this.Created,
            "expired": this.Expired,
            "jwt": this.Jwt,
            "user_email": this.UserEmail,
            "user_id": this.UserId,
        }
    }

    private DecodeJwt
    (
        jwt : string
    )
    {
        if (
            // Se o JWT não for nulo e o ID ou email não forem nulos, retorna
            (
                !IsUndNull(this.Jwt) &&
                (
                    !IsUndNull(this.UserId) &&
                    !IsUndNull(this.UserEmail)
                )
            ) ||
            // Se o jwt não for nulo e o ID ou email não forem nulos, retorna
            (
                !IsUndNull(jwt) &&
                (
                    !IsUndNull(this.UserId) &&
                    !IsUndNull(this.UserEmail)
                )
            ) ||
            // Se o JWT e jwt forem nulos, retorna
            (
                IsUndNull(this.Jwt) &&
                IsUndNull(jwt)
            )
        )
            return

        const decoded = verify(jwt, env.JwtSecret(), { ignoreExpiration: true })

        const userId = (decoded as any)["user_id"]
        const userEmail = (decoded as any)["user_email"]

        if (IsUndNull(this.UserId))
            this.UserId = userId

        if (IsUndNull(this.UserEmail))
            this.UserEmail = userEmail

        const isExpired = IsJwtExpired(decoded as string)

        if (isExpired) {
            this.Expired = true
            this.Completed = true
        }
    }

    CreateJwt()
    {
        if (IsUndNull(this.UserId) || IsUndNull(this.UserEmail))
            throw new Error("Impossível criar JWT sem ID ou Email de usuário.")

        this.Jwt = sign(
            {
                "user_id": this.UserId,
                "user_email": this.UserEmail
            },
            env.JwtSecret(),
            { expiresIn: "30m" }
        )
    }

    async GetForeignKey(db : Client)
    {
        if (!IsUndNull(this.UserId))
            this.User = await UserBase.Get(db, this.UserId)
    }
}

export default UserAccountRestoration
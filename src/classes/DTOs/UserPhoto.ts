import { Client } from "pg"

import Possession from "../entities/base/Possession"
import UserBase from "../bases/UserBase"

import IsUndNull from "../../functions/IsUndNull"

class UserPhoto extends Possession
{
    UserId : number
    Base64 : string

    override ModifiedBy : null
    // Active não existe

    constructor(body : any)
    {
        super()
        this.UserId = !IsUndNull(body["UserId"]) ? body["UserId"] : body["user_id"]
        this.Base64 = !IsUndNull(body["Base64"]) ? body["Base64"] : body["base_64"]
    }

    async GetUser(db : Client)
    {
        return await UserBase.Get(db, this.UserId)
    }
}

export default UserPhoto
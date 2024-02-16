import { Client } from "pg"

import EntityBasic from "../base/EntityBasic"
import User from "./User"
import UserBase from "../../bases/UserBase"

import IEntityWithForeignKey from "../../../interfaces/IEntityWithForeignKey"

import FindValue from "../../../functions/logic/FindValue"
import IsUndNull from "../../../functions/logic/IsUndNull"

class UserPhoto extends EntityBasic implements IEntityWithForeignKey
{
    Base64 : string
    Created : Date
    Modified : Date
    User : User
    UserId : number

    constructor(body : any)
    {
        super(body)
        this.ConvertBody(body)
    }

    ConvertBody(body: any) : void
    {
        this.Base64 = FindValue(body, ["Base64", "base_64"])
        this.Created = FindValue(body, ["Created", "created"])
        this.Modified = FindValue(body, ["Modified", "modified"])
        this.UserId = FindValue(body, ["UserId", "user_id"])
    }

    ConvertToSqlObject()
    {
        return {
            "id": this.Id,
            "base_64": this.Base64,
            "created": this.Created,
            "modified": this.Modified,
            "user_id": this.UserId,
            "user": this.User
        }
    }

    async GetForeignKey(db : Client)
    {
        const user = await UserBase.Get(db, this.UserId)

        if (!IsUndNull(user))
            this.User = user!
    }
}

export default UserPhoto
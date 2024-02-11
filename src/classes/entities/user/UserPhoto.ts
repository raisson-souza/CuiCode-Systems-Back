import { Client } from "pg"

import UserBase from "../../bases/UserBase"

import EntityBasic from "../base/EntityBasic"
import User from "./User"

import FindValue from "../../../functions/logic/FindValue"

import AnySearch from "../../../interfaces/AnySearch"

class UserPhoto extends EntityBasic
{
    UserId : number
    Base64 : string
    Created : Date
    Modified : Date
    User : User

    constructor(body : any)
    {
        super(body)
        this.ConvertBody(body)
    }

    ConvertBody(body: any) : void
    {
        this.UserId = FindValue(body, ["UserId", "user_id"])
        this.Base64 = FindValue(body, ["Base64", "base_64"])
        this.Created = FindValue(body, ["Created", "created"])
        this.Modified = FindValue(body, ["Modified", "modified"])
    }

    ConvertToSqlObject() : AnySearch
    {
        const userPhotoSql : AnySearch = {
            "user_id": this.UserId,
            "base_64": this.Base64,
            "created": this.Created,
            "modified": this.Modified
        }

        return userPhotoSql
    }

    async GetUser(db : Client)
    {
        const user = await UserBase.Get(db, this.UserId)
        this.User = user!
        return user
    }
}

export default UserPhoto
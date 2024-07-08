import EntityBasic from "../base/EntityBasic"
import User from "./User"

import FindValue from "../../../functions/logic/FindValue"

export default class UserPhoto extends EntityBasic
{
    PhotoBase64 : string
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
        this.PhotoBase64 = FindValue(body, ["PhotoBase64", "photo_base_64"])
        this.Created = FindValue(body, ["Created", "created"])
        this.Modified = FindValue(body, ["Modified", "modified"])
        this.UserId = FindValue(body, ["UserId", "user_id"])
    }

    ConvertToSqlObject()
    {
        return {
            "id": this.Id,
            "photo_base_64": this.PhotoBase64,
            "created": this.Created,
            "modified": this.Modified,
            "user_id": this.UserId,
            "user": this.User
        }
    }
}
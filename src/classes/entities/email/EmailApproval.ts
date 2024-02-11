import EntityBasic from "../base/EntityBasic"

import AnySearch from "../../../interfaces/AnySearch"

import FindValue from "../../../functions/logic/FindValue"

class EmailApproval extends EntityBasic
{
    UserId : number
    Email : string
    Approved : boolean
    ApprovedDate : Date
    Created : Date
    
    constructor(body : any)
    {
        super(body)
        this.ConvertBody(body)
    }

    ConvertBody(body: any) : void
    {
        this.UserId = FindValue(body, ["UserId", "user_id"])
        this.Email = FindValue(body, ["Email", "email"])
        this.Approved = FindValue(body, ["Approved", "approved"])
        this.ApprovedDate = FindValue(body, ["ApprovedDate", "approved_date"])
        this.Created = FindValue(body, ["Created", "created"])
    }

    ConvertToSqlObject() : AnySearch
    {
        throw new Error("Method not implemented.")
    }
}


export default EmailApproval
import EntityBasic from "../base/EntityBasic"

import FindValue from "../../../functions/logic/FindValue"

class EmailApproval extends EntityBasic
{
    Approved : boolean
    ApprovedDate : Date
    Created : Date
    Email : string
    UserId : number
    
    constructor(body : any)
    {
        super(body)
        this.ConvertBody(body)
    }

    ConvertBody(body: any) : void
    {
        this.Approved = FindValue(body, ["Approved", "approved"])
        this.ApprovedDate = FindValue(body, ["ApprovedDate", "approved_date"])
        this.Created = FindValue(body, ["Created", "created"])
        this.Email = FindValue(body, ["Email", "email"])
        this.UserId = FindValue(body, ["UserId", "user_id"])
    }

    ConvertToSqlObject()
    {
        return {
            "id": this.Id,
            "approved_date": this.ApprovedDate,
            "approved": this.Approved,
            "created": this.Created,
            "email": this.Email,
            "user_id": this.UserId,
        }
    }
}

export default EmailApproval
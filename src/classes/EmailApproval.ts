import Entity from "./Entity"

class EmailApproval extends Entity
{
    UserId : number
    Email : string
    Approved : boolean

    constructor
    (
        id : number,
        user_id : number,
        email : string,
        approved : boolean
    )
    {
        super()
        this.Id = id
        this.UserId = user_id
        this.Email = email
        this.Approved = approved
    }
}

class EmailApprovalSql extends EmailApproval
{
    RawData : any

    constructor(row : any)
    {
        super(row["id"], row["user_id"], row["email"], row["approved"])
        this.RawData = row
    }
}

export { EmailApproval, EmailApprovalSql }
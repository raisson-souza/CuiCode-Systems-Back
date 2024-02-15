import AnySearch from "../../../interfaces/AnySearch"

import { EntityLog } from "../base/EntityLog"
import EntityBasic from "../base/EntityBasic"

import FindValue from "../../../functions/logic/FindValue"

class Log extends EntityBasic
{
    EntityReferenceNameObj : string
    EntityReferenceNameSql : string

    AdmChange : boolean
    Change : EntityLog[] | string
    Date : Date
    EntityReferenceId : number
    ModifiedBy : number

    constructor
    (
        body : any,
        entityReferenceNameObj : string,
        entityReferenceNameSql : string
    )
    {
        super(body)
        this.EntityReferenceNameObj = entityReferenceNameObj
        this.EntityReferenceNameSql = entityReferenceNameSql
        this.ConvertBody(body)
    }

    ConvertBody(body: any) : void
    {
        this.AdmChange = FindValue(body, ["AdmChange", "adm_change"])
        this.Change = FindValue(body, ["Change", "change"])
        this.Date = FindValue(body, ["Date","date"])
        this.EntityReferenceId = FindValue(body, [this.EntityReferenceNameObj, this.EntityReferenceNameSql])
        this.ModifiedBy = FindValue(body, ["ModifiedBy", "modified_by"])
    }

    ConvertToSqlObject()
    {
        let obj : AnySearch =  {
            "adm_change": this.AdmChange,
            "change": this.Change,
            "date": this.Date,
            "modified_by": this.ModifiedBy,
        }
        obj[`${ this.EntityReferenceNameSql }`] = this.EntityReferenceId

        return obj
    }
}

export default Log
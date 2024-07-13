import EntityBasic from "../base/EntityBasic"

import FindValue from "../../../functions/logic/FindValue"

export default class SystemError extends EntityBasic
{
    Date : Date
    Message : string
    /** Log das AppServices / Contexto / Título do erro. */
    Log : string

    constructor(body : any)
    {
        super(body)
        this.ConvertBody(body)
    }

    ConvertBody(body : any)
    {
        this.Date = FindValue(body, ["Date", "date"])
        this.Message = FindValue(body, ["Message", "message"])
        this.Log = FindValue(body, ["Log", "log"])
    }

    ConvertToSqlObject()
    {
        return {
            "id": this.Id,
            "date": this.Date,
            "message": this.Message,
            "log": this.Log,
        }
    }
}
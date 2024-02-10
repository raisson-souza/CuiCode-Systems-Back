import EntityBasic from "./EntityBasic"

import FindValue from "../../../functions/logic/FindValue"

abstract class EntityRegistry extends EntityBasic
{
    Active : boolean
    Deleted : boolean
    Created : Date
    Modified : Date

    constructor(body : any)
    {
        super(body)
        this.Active = FindValue(body, ["Active", "active"])
        this.Deleted = FindValue(body, ["Deleted", "deleted"])
        this.Created = FindValue(body, ["Created", "created"])
        this.Modified = FindValue(body, ["Modified", "modified"])
    }
}

export default EntityRegistry
import EntityBasic from "./EntityBasic"

import FindValue from "../../../functions/logic/FindValue"

abstract class EntityPossession extends EntityBasic
{
    CreatedBy : number
    ModifiedBy : number

    constructor(body : any)
    {
        super(body)
        this.CreatedBy = FindValue(body, ["CreatedBy", "created_by"])
        this.ModifiedBy = FindValue(body, ["ModifiedBy", "modified_by"])
    }
}

export default EntityPossession
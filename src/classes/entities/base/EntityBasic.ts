import AnySearch from "../../../interfaces/AnySearch"
import IEntityBasic from "../../../interfaces/IEntityBasic"

import FindValue from "../../../functions/logic/FindValue"

abstract class EntityBasic implements IEntityBasic
{
    Id: number

    constructor(body : any)
    {
        this.Id = FindValue(body, ["Id", "id"])
    }

    abstract ConvertBody(body: any) : void

    abstract ConvertToSqlObject() : AnySearch
}

export default EntityBasic
import IEntityBasic from "../../../interfaces/IEntityBasic"

import FindValue from "../../../functions/logic/FindValue"
import UndNullPropsFormatting from "../../../functions/formatting/UndNullPropsFormatting"

abstract class EntityBasic implements IEntityBasic
{
    Id: number

    constructor(body : any)
    {
        this.Id = FindValue(body, ["Id", "id"])
    }

    abstract ConvertBody(body: any) : void

    abstract ConvertToSqlObject() : any

    ShowPopulatedPropsOnly() : any
    {
        return UndNullPropsFormatting({ ...this })
    }
}

export default EntityBasic
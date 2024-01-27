import IEntity from "../interfaces/IEntity"

abstract class Entity implements IEntity
{
    Id : number
    Active : boolean
    Created : Date
    Deleted : boolean
    Modified : Date | null
    ModifiedBy : number | null
}

export default Entity
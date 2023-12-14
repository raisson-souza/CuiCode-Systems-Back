import IEntity from "../interfaces/IEntity"

abstract class Entity implements IEntity
{
    Id: number
    Active: boolean
    CreatedDate: Date
    Deleted: boolean
}

export default Entity
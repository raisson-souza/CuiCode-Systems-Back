export default abstract class Entity implements IEntity
{
    Id: number
    Active: boolean
    CreatedDate: Date
    Deleted: boolean
}

interface IEntity
{
    Id : number
    Active : boolean
    CreatedDate : Date
    Deleted : boolean
}

export default interface IEntityBasic
{
    Id : number

    ConvertBody(body : any) : void

    ConvertToSqlObject() : any
}
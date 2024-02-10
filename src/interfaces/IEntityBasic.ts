import AnySearch from "./AnySearch"

interface IEntityBasic
{
    Id : number

    ConvertBody(body : any) : void

    ConvertToSqlObject(removeUndNulls : boolean) : AnySearch
}

export default IEntityBasic
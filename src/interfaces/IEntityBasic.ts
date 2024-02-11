import AnySearch from "./AnySearch"

interface IEntityBasic
{
    Id : number

    ConvertBody(body : any) : void

    ConvertToSqlObject() : AnySearch
}

export default IEntityBasic
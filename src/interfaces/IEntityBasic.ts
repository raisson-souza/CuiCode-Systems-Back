import AnySearch from "./AnySearch"

interface IEntityBasic
{
    Id : number

    ConvertBody(body : any) : void

    ConvertToSqlObject() : any
}

export default IEntityBasic
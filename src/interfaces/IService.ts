export default interface IService
{
    CheckBody(body : any) : any
    CheckQuery(query : any) : any
    readonly Action : string
    Operation() : any
}
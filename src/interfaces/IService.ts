interface IService
{
    CheckBody(body : any) : any
    CheckQuery(query : any) : any
    readonly Action : string
    Operation() : any
    AuthenticateRequestor() : void
    ValidateRequestor() : void
}

export default IService
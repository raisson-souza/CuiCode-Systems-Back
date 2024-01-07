import PermissionLevelEnum from "../enums/PermissionLevelEnum"

interface IService
{
    CheckBody(body : any) : any
    CheckQuery(query : any) : any
    readonly Action : string
    Operation() : any
    AuthenticateRequestor(level : PermissionLevelEnum, userIdToOperate : number) : void
}

export default IService
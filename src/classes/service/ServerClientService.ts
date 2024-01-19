import { Request, Response } from "express"

import ClientService from "./ClientService"
import ServerService from "./ServerService"
import Service from "./base/Service"

import PermissionLevelEnum from "../../enums/PermissionLevelEnum"

abstract class ServerClientService extends Service
{
    IsSystemRequestor : boolean
    SameUserAuthAndUserToOperate : boolean

    constructor(req : Request, res : Response) { super(req, res) }

    abstract Operation() : void

    /**
     * Primeiramente tenta autenticar o sistema, caso não seja o sistema o requeridor, autenticará o usuário.
     * @sendHeaders Parâmetro especial para a classe ServerClientService [Nulo]
     * @userIdToOperate ID do usuário a ser operado (Valida se é diferente daquele que requer a ação) [Nulo]
     * @level Nível mínimo permitido para o usuário requeridor realizar a ação [Membro]
     * @allowDifferentUserAuthAndUserToOperate Permite que usuários requeridores realizem ações sobre outros sem serem adm [Falso]
     */
    async AuthenticateRequestor
    (
        userIdToOperate : number | null = null,
        level : PermissionLevelEnum = PermissionLevelEnum.Member,
        allowDifferentUserAuthAndUserToOperate : boolean = false
    )
    {
        try
        {
            const serverServiceClass = ServerService
            serverServiceClass.prototype.REQ = this.REQ
            serverServiceClass.prototype.AuthenticateRequestor(null, null, false)
            this.SameUserAuthAndUserToOperate = false
            this.IsSystemRequestor = true
            this.USER_auth = null
        }
        catch
        {
            this.IsSystemRequestor = false
            const clientServiceClass = ClientService
            clientServiceClass.prototype.REQ = this.REQ
            clientServiceClass.prototype.DB_connection = this.DB_connection
            await clientServiceClass.prototype.AuthenticateRequestor(userIdToOperate, level, allowDifferentUserAuthAndUserToOperate, false)
            this.USER_auth = clientServiceClass.prototype.USER_auth
            this.SameUserAuthAndUserToOperate = clientServiceClass.prototype.SameUserAuthAndUserToOperate
        }
    }
}

export default ServerClientService
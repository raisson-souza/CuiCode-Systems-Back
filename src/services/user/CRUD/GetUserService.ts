import QueryUser from "../utilities/QueryUser"

import ResponseMessage from "../../../classes/system/ResponseMessage"
import ServerClientService from "../../../classes/service/ServerClientService"

import IsUndNull from "../../../functions/logic/IsUndNull"

import PermissionLevelEnum from "../../../enums/PermissionLevelEnum"
import HttpStatusEnum from "../../../enums/system/HttpStatusEnum"

/**
 * Queries a user.
 */
class GetUserService extends ServerClientService
{
    Action = "Consulta de usuário."

    CheckBody() { throw new Error("Method not implemented.") }

    CheckQuery() : number
    {
        const query = this.REQ.query as any

        if (IsUndNull(query.UserId))
        {
            ResponseMessage.SendNullField(["UserId"], this.Action, this.RES)
            throw new Error("Id de usuário não encontrado na URL.");
        }

        if (query.UserId < 0)
        {
            ResponseMessage.SendInvalidField(["UserId"], this.Action, this.RES)
            throw new Error("Id de usuário inválido.");
        }

        return Number.parseInt(query.UserId)
    }

    async Operation()
    {
        try
        {
            await this.AuthenticateRequestor()

            const {
                RES,
                DB_connection,
                Action
            } = this

            const userId = this.CheckQuery()

            this.ValidateRequestor(PermissionLevelEnum.Member, userId, true)

            const nonPrivateLevelQuery = this.ResolveNonPrivateLevelQuery()

            await Promise.resolve(QueryUser(DB_connection, userId, nonPrivateLevelQuery))
                .then(user => {
                    ResponseMessage.Send(
                        HttpStatusEnum.OK,
                        user,
                        Action,
                        RES
                    )
                })
                .catch(ex => {
                    throw new Error((ex as Error).message)
                })
        }
        catch (ex)
        {
            ResponseMessage.Send(
                HttpStatusEnum.INTERNAL_SERVER_ERROR,
                `Houve um erro ao consultar o usuário. Erro: ${ (ex as Error).message }`,
                this.Action,
                this.RES
            )
        }
        finally
        {
            this.DB_connection.end()
        }
    }

    /**
     * Retorna VERDADEIRO para buscar apenas informações não-confidenciais e FALSO para buscar todas as informações.
     */
    private ResolveNonPrivateLevelQuery() : boolean
    {
        const systemQueryLevel = this.GetReqValue("SystemQueryLevel")

        if (this.IsSystemRequestor)
        {
            switch (IsUndNull(systemQueryLevel) ? 1 : Number.parseInt(systemQueryLevel!))
            {
                case 1:
                    return false
                case 2:
                    return true
                default:
                    return false
            }
        }

        if
        (
            this.SameUserAuthAndUserToOperate ||
            this.USER_auth!.PermissionLevel!.Value == PermissionLevelEnum.Root ||
            this.USER_auth!.PermissionLevel!.Value == PermissionLevelEnum.Adm
        )
            return false

        return true
    }
}

export default GetUserService
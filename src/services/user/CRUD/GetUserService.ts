import QueryUser from "../utilities/QueryUser"

import Exception from "../../../classes/custom/Exception"
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
        const userId = Number.parseInt(this.REQ.query.UserId as string)

        if (IsUndNull(userId))
            ResponseMessage.SendNullField(["UserId"], this.Action, this.RES)

        if (userId < 0)
            ResponseMessage.SendInvalidField(["UserId"], this.Action, this.RES)

        return userId
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
            Exception.UnexpectedError((ex as Error).message, this.Action)
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
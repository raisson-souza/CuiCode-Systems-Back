import Service from "../../../classes/Service"

import IService from "../../../interfaces/IService"

import QueryUser from "../utilities/QueryUser"

import IsUndNull from "../../../functions/IsUndNull"
import Send from "../../../functions/Responses"

/**
 * Queries a user.
 */
export default class GetUserService extends Service implements IService
{
    Action = "Consulta de usuário."

    CheckBody()
    {
        throw new Error("Method not implemented.")
    }

    CheckQuery(query : any) : number
    {
        if (IsUndNull(query.UserId))
            throw new Error("Id de usuário não encontrado na URL.");

        if (query.UserId < 0)
            throw new Error("Id de usuário inválido.");

        return Number.parseInt(query.UserId)
    }

    async GetUserServiceOperation()
    {
        try
        {
            const {
                REQ,
                RES,
                DB_connection,
                Action
            } = this

            const userId = this.CheckQuery(REQ.query)

            await Promise.resolve(QueryUser(DB_connection, userId))
                .then(user => {
                    Send.Ok(RES, user, Action)
                })
                .catch(ex => {
                    Send.Error(RES, `Houve um erro ao consultar o usuário. Erro: ${ ex.message }`, Action)
                })
        }
        catch (ex)
        {
            Send.Error(this.RES, `Houve um erro ao consultar o usuário. Erro: ${ (ex as Error).message }`, this.Action)
        }
        finally
        {
            this.DB_connection.end()
        }
    }
}
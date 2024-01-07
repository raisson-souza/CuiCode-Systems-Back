import QueryUser from "../utilities/QueryUser"

import ServerService from "../../../classes/service/ServerService"

import IsUndNull from "../../../functions/IsUndNull"
import Send from "../../../functions/system/Send"

/**
 * Queries a user.
 */
class GetUserService extends ServerService
{
    Action = "Consulta de usuário."

    CheckBody() { throw new Error("Method not implemented.") }

    CheckQuery(query : any) : number
    {
        if (IsUndNull(query.UserId))
            throw new Error("Id de usuário não encontrado na URL.");

        if (query.UserId < 0)
            throw new Error("Id de usuário inválido.");

        return Number.parseInt(query.UserId)
    }

    async Operation()
    {
        try
        {
            const {
                REQ,
                RES,
                DB_connection,
                Action
            } = this

            this.AuthenticateRequestor()

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

export default GetUserService
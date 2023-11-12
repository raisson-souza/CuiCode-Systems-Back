import Service from "../../../classes/Service"

import IService from "../../../interfaces/IService"

import IsUndNull from "../../../functions/IsUndNull"
import Send from "../../../functions/Responses"

import QueryUsersInfo from "../utilities/QueryUsersInfo"

/**
 * Queries specific information about all users.
 */
export default class ListUsersService extends Service implements IService
{
    Action = "Listagem de usuários."

    CheckBody()
    {
        throw new Error("Method not implemented.")
    }

    CheckQuery(query : any) : Array<string>
    {
        if (IsUndNull(query.RequiredInfo))
            throw new Error("Informações requeridas dos usuários não encontradas na URL.")

        const JsonConvertedQuery = JSON.parse(query.RequiredInfo)

        const RequiredInfoArray = new Array(JsonConvertedQuery)

        return RequiredInfoArray[0]
    }

    async ListUsersServiceOperation()
    {
        try
        {
            const {
                REQ,
                RES,
                DB_connection,
                Action
            } = this

                // O FRONT-END DEVE ENVIAR AS INFORMAÇÕES JÁ CONVERTIDAS PARA OS MESMOS CAMPOS DO BANCO
                const userRequiredInfo = this.CheckQuery(REQ.query)

                await Promise.resolve(QueryUsersInfo(DB_connection, userRequiredInfo))
                    .then(userInfos => {
                        Send.Ok(RES, userInfos, Action)
                    })
                    .catch(ex => {
                        Send.Error(RES, `Houve um erro ao listar as informações requeridas dos usuários. Erro: ${ ex.message }`, Action)
                    })
        }
        catch (ex)
        {
            Send.Error(this.RES, `Houve um erro ao listar as informações requeridas dos usuários. Erro: ${ (ex as Error).message }`, this.Action)
        }
        finally
        {
            this.DB_connection.end()
        }
    }
}
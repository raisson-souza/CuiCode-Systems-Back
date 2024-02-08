import QueryUsersInfo from "../utilities/QueryUsersInfo"

import Exception from "../../../classes/custom/Exception"
import ResponseMessage from "../../../classes/system/ResponseMessage"
import ServerService from "../../../classes/service/ServerService"

import IsUndNull from "../../../functions/logic/IsUndNull"

import HttpStatusEnum from "../../../enums/system/HttpStatusEnum"

/**
 * Queries specific information about all users.
 */
class ListUsersService extends ServerService
{
    Action = "Listagem de usuários."

    CheckBody() { throw new Error("Method not implemented.") }

    CheckQuery() : Array<string>
    {
        const query = this.REQ.query as any

        if (IsUndNull(query.RequiredInfo))
            ResponseMessage.SendNullField(["RequiredInfo"], this.Action, this.RES)

        const JsonConvertedQuery = JSON.parse(query.RequiredInfo)

        const RequiredInfoArray = new Array(JsonConvertedQuery)

        return RequiredInfoArray[0]
    }

    async Operation()
    {
        try
        {
            const {
                RES,
                DB_connection,
                Action
            } = this

            this.AuthenticateRequestor()

            // O FRONT-END DEVE ENVIAR AS INFORMAÇÕES JÁ CONVERTIDAS PARA OS MESMOS CAMPOS DO BANCO
            const userRequiredInfo = this.CheckQuery()

            await Promise.resolve(QueryUsersInfo(DB_connection, userRequiredInfo))
                .then(userInfos => {
                    ResponseMessage.Send(
                        HttpStatusEnum.OK,
                        userInfos,
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
                `Houve um erro ao listar as informações requeridas dos usuários. Erro: ${ (ex as Error).message }`,
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
}

export default ListUsersService
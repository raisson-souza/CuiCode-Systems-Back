import ClientService from "../../../../classes/service/ClientService"
import Exception from "../../../../classes/custom/Exception"
import ResponseMessage from "../../../../classes/system/ResponseMessage"
import UserBase from "../../../../classes/bases/UserBase"

import IsUndNull from "../../../../functions/logic/IsUndNull"

import HttpStatusEnum from "../../../../enums/system/HttpStatusEnum"
import PermissionLevelEnum from "../../../../enums/PermissionLevelEnum"

/**
 * Captura a foto de um usuário.
 */
class GetUserPhoto extends ClientService
{
    Action = "Busca de foto de usuário."

    CheckBody() { }

    CheckQuery() : number
    {
        const userId = this.REQ.params.user_id

        if (IsUndNull(userId)) {
            ResponseMessage.SendNullField({
                expressResponse: this.RES,
                fields: ["UserId"],
                log: this.Action
            })
        }

        return Number.parseInt(userId as string)
    }

    CheckParams() { }

    async Operation()
    {
        try
        {
            const userId = this.CheckQuery()

            this.AuthenticateRequestor()

            const user = await UserBase.Get(this.DB_connection, userId)

            this.ValidateRequestor(PermissionLevelEnum.Member, userId)

            if (IsUndNull(user)) {
                ResponseMessage.NotFoundUser({
                    expressResponse: this.RES,
                    log: this.Action
                })
            }

            const userPhoto = await UserBase.GetPhoto(this.DB_connection, user!.Id)

            if (IsUndNull(userPhoto))
            {
                ResponseMessage.Send({
                    status: HttpStatusEnum.NOT_FOUND,
                    data: "O usuário não possui foto.",
                    log: this.Action,
                    expressResponse: this.RES
                })
            }
            else
            {
                ResponseMessage.Send({
                    status: HttpStatusEnum.OK,
                    data: userPhoto,
                    log: this.Action,
                    expressResponse: this.RES
                })
            }
        }
        catch (ex)
        {
            ResponseMessage.Send({
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR,
                data: `Houve um erro ao consultar o usuário. Erro: ${ (ex as Error).message }`,
                log: this.Action,
                expressResponse: this.RES
            })
            Exception.UnexpectedError((ex as Error).message, this.Action)
        }
        finally
        {
            this.DB_connection.end()
        }
    }
}

export default GetUserPhoto
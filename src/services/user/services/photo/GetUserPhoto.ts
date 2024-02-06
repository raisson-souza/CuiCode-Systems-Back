import ClientService from "../../../../classes/service/ClientService"
import ResponseMessage from "../../../../classes/DTOs/ResponseMessage"
import UserBase from "../../../../classes/bases/UserBase"

import IsUndNull from "../../../../functions/IsUndNull"

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

        if (IsUndNull(userId))
        {
            ResponseMessage.SendNullField(["UserId"], this.Action, this.RES)
            throw new Error("Id de usuário não encontrado na URL.");
        }

        return Number.parseInt(userId as string)
    }

    async Operation()
    {
        try
        {
            const userId = this.CheckQuery()

            this.AuthenticateRequestor()

            const user = await UserBase.Get(this.DB_connection, userId)

            this.ValidateRequestor(PermissionLevelEnum.Member, userId)

            if (IsUndNull(user))
            {
                ResponseMessage.NotFoundUser(this.RES, this.Action)
                throw new Error("Usuário não encontrado.")
            }

            const userPhoto = await UserBase.GetPhoto(this.DB_connection, user!.Id)

            if (IsUndNull(userPhoto))
            {
                ResponseMessage.Send(
                    HttpStatusEnum.NOT_FOUND,
                    "O usuário não possui foto.",
                    this.Action,
                    this.RES
                )
            }
            else
            {
                ResponseMessage.Send(
                    HttpStatusEnum.OK,
                    userPhoto,
                    this.Action,
                    this.RES
                )
            }
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
}

export default GetUserPhoto
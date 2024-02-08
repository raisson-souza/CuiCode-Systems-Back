import ClientService from "../../../../classes/service/ClientService"
import Exception from "../../../../classes/custom/Exception"
import ResponseMessage from "../../../../classes/system/ResponseMessage"
import UserBase from "../../../../classes/bases/UserBase"

import IsUndNull from "../../../../functions/logic/IsUndNull"

import HttpStatusEnum from "../../../../enums/system/HttpStatusEnum"
import PermissionLevelEnum from "../../../../enums/PermissionLevelEnum"

/**
 * Registra a foto de um usuário.
 */
class RegistryUserPhoto extends ClientService
{
    Action : string = "Cadastro / Atualização de foto de perfil de usuário."

    CheckBody() : {
        userPhoto : string,
        userId : number
    }
    {
        const { REQ, RES, Action } = this

        const userId = REQ.params.user_id
        const userbase64Photo = REQ.body["photo"]

        if (IsUndNull(userId))
            ResponseMessage.SendInvalidField(['user_id'], Action, RES)

        if (IsUndNull(userbase64Photo))
            ResponseMessage.SendNullField(["photo"], Action, RES)

        return {
            userPhoto: userbase64Photo,
            userId: Number.parseInt(userId)
        }
    }

    CheckQuery() { }

    async Operation()
    {
        try
        {
            const {
                userId,
                userPhoto
            } = this.CheckBody()

            const user = await UserBase.Get(this.DB_connection, userId)

            if (IsUndNull(user))
                ResponseMessage.NotFoundUser(this.RES, this.Action)

            await this.AuthenticateRequestor()
            this.ValidateRequestor(PermissionLevelEnum.Member, user!.Id)

            await UserBase.CreateOrUpdatePhoto(this.DB_connection, user!.Id, userPhoto)

            ResponseMessage.Send(
                HttpStatusEnum.OK,
                'Foto de usuário atualizada com sucesso.',
                this.Action,
                this.RES
            )
        }
        catch (ex)
        {
            ResponseMessage.Send(
                HttpStatusEnum.INTERNAL_SERVER_ERROR,
                `Houve um erro ao cadastrar a foto do usuário. Erro: ${ (ex as Error).message }`,
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

export default RegistryUserPhoto
import ClientService from "../../../../classes/service/ClientService"
import ResponseMessage from "../../../../classes/DTOs/ResponseMessage"
import UserBase from "../../../../classes/bases/UserBase"

import IsUndNull from "../../../../functions/IsUndNull"

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
        {
            ResponseMessage.SendInvalidField(['user_id'], Action, RES)
            throw new Error("ID de usuário não encontrado.")
        }

        if (IsUndNull(userbase64Photo))
        {
            ResponseMessage.SendNullField(["photo"], Action, RES)
            throw new Error("Request inválida.")
        }

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
            {
                ResponseMessage.NotFoundUser(this.RES, this.Action)
                throw new Error("Usuário não encontrado.")
            }

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
        }
        finally
        {
            this.DB_connection.end()
        }
    }
}

export default RegistryUserPhoto
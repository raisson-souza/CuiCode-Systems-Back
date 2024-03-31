import { verify } from "jsonwebtoken"

import Env from "../../config/Env"

import ClientService from "../../classes/service/ClientService"
import Exception from "../../classes/custom/Exception"
import ResponseMessage from "../../classes/system/ResponseMessage"
import User from "../../classes/entities/user/User"
import UserBase from "../../classes/bases/UserBase"

import IsUndNull from "../../functions/logic/IsUndNull"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"

type ValidateJwtResponse = {
    ok : boolean,
    user : User | null
}

/**
 * Realiza a validação de um token de usuário para permitir acesso a rotas privadas no front.
 */
class ValidateJwtService extends ClientService
{
    Action : string = "Validação de JWT."

    CheckBody() { }

    CheckQuery() : string
    { 
        const jwt = this.REQ.query["jwt"]

        if (IsUndNull(jwt)) {
            ResponseMessage.SendNullField({
                expressResponse: this.RES,
                fields: ["jwt"],
                log: this.Action
            })
        }

        return jwt as string
    }

    CheckParams() { }

    async Operation()
    {
        try
        {
            const jwt = this.CheckQuery()
            let user : User | null = null

            try
            {
                const decoded = verify(jwt, Env.JWT_key) as any
                const userId = Number.parseInt(decoded["UserAuthId"] as string)

                user = await UserBase.Get(this.DB_connection, userId)

                const userPhoto = await UserBase.GetPhoto(this.DB_connection, user!.Id)

                if (!IsUndNull(userPhoto))
                    user!.PhotoBase64 = userPhoto!.PhotoBase64
            }
            catch (ex)
            {
                ResponseMessage.Send({
                    status: HttpStatusEnum.INVALID,
                    data: {
                        ok: false,
                        user: null
                    } as ValidateJwtResponse,
                    log: this.Action,
                    expressResponse: this.RES
                })
                Exception.Error((ex as Error).message, this.Action)
            }

            ResponseMessage.Send({
                status: HttpStatusEnum.OK,
                data: {
                    ok: true,
                    user: user
                } as ValidateJwtResponse,
                log: this.Action,
                expressResponse: this.RES
            })
        }
        catch (ex)
        {
            ResponseMessage.Send({
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR,
                data: `Houve um erro ao validar o JWT. Erro: ${ (ex as Error).message }`,
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

export default ValidateJwtService
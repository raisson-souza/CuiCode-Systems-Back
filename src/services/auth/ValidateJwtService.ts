import { verify } from "jsonwebtoken"

import Env from "../../config/Env"

import ClientService from "../../classes/service/ClientService"
import Exception from "../../classes/custom/Exception"
import ResponseMessage from "../../classes/system/ResponseMessage"

import IsUndNull from "../../functions/logic/IsUndNull"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"

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

        if (IsUndNull(jwt))
            ResponseMessage.SendNullField(["jwt"], this.Action, this.RES)

        return jwt as string
    }

    CheckParams() { }

    async Operation()
    {
        try
        {
            const jwt = this.CheckQuery()

            try
            {
                verify(jwt, Env.JWT_key)
            }
            catch (ex)
            {
                ResponseMessage.Send(
                    HttpStatusEnum.INVALID,
                    false,
                    this.Action,
                    this.RES
                )
                Exception.Error((ex as Error).message, this.Action)
            }

            ResponseMessage.Send(
                HttpStatusEnum.OK,
                true,
                this.Action,
                this.RES
            )
        }
        catch (ex)
        {
            ResponseMessage.Send(
                HttpStatusEnum.INTERNAL_SERVER_ERROR,
                `Houve um erro ao validar o JWT. Erro: ${ (ex as Error).message }`,
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

export default ValidateJwtService
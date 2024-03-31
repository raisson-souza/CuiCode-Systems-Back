import ClientService from "../../../../classes/service/ClientService"
import Exception from "../../../../classes/custom/Exception"
import ResponseMessage from "../../../../classes/system/ResponseMessage"
import UserBase from "../../../../classes/bases/UserBase"
import UserRepository from "../../../../repositories/UserRepository"

import IsUndNull from "../../../../functions/logic/IsUndNull"
import SqlInjectionVerifier from "../../../../functions/SQL/SqlInjectionVerifier"

import HttpStatusEnum from "../../../../enums/system/HttpStatusEnum"

/**
 * Verifica a existência de um usuário pelo email.
 * Uso principal: Recuperação de conta.
 */
class VerifyEmailService extends ClientService
{
    Action = "Vericação de usuário por email."

    CheckBody() { }
    
    CheckQuery() : string
    {
        const email = this.REQ.query["email"]

        if (IsUndNull(email)) {
            ResponseMessage.SendNullField({
                expressResponse: this.RES,
                fields: ["email"],
                log: this.Action
            })
        }

        return String(email)
    }

    CheckParams() { }

    async Operation()
    {
        try
        {
            const {
                DB_connection,
            } = this

            const email = this.CheckQuery()

            SqlInjectionVerifier(email)

            UserRepository.ValidateEmail(email)

            const user = await UserBase.GetByEmail(DB_connection, email)

            if (IsUndNull(user)) {
                ResponseMessage.NotFoundUser({
                    expressResponse: this.RES,
                    log: this.Action
                })
            }

            ResponseMessage.Send({
                status: HttpStatusEnum.OK,
                data: `Usuário com email ${ email } encontrado no sistema.\nDeseja iniciar o processo de recuperação de conta?`,
                log: this.Action,
                expressResponse: this.RES
            })
        }
        catch (ex)
        {
            ResponseMessage.Send({
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR,
                data: `Houve um erro ao buscar o usuário. Erro: ${ (ex as Error).message }`,
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

export default VerifyEmailService
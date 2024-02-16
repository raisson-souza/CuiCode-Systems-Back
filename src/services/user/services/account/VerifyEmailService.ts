import ClientService from "../../../../classes/service/ClientService"
import Exception from "../../../../classes/custom/Exception"
import ResponseMessage from "../../../../classes/system/ResponseMessage"
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

        if (IsUndNull(email))
            ResponseMessage.SendNullField(["email"], this.Action, this.RES)

        return String(email)
    }

    CheckParams() { }

    async Operation()
    {
        try
        {
            const {
                DB_connection,
                Action
            } = this

            const email = this.CheckQuery()

            SqlInjectionVerifier(email)

            UserRepository.ValidateEmail(email)

            await DB_connection.query(`SELECT id FROM users WHERE email = '${email}'`)
                .then(result => {
                    if (result.rowCount === 0)
                        ResponseMessage.NotFoundUser(this.RES, Action)

                    ResponseMessage.Send(
                        HttpStatusEnum.OK,
                        `Usuário com email ${ email } encontrado no sistema.\nDeseja iniciar o processo de recuperação de conta?`,
                        Action,
                        this.RES
                    )
                })
        }
        catch (ex)
        {
            ResponseMessage.Send(
                HttpStatusEnum.INTERNAL_SERVER_ERROR,
                `Houve um erro ao buscar o usuário. Erro: ${ (ex as Error).message }`,
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

export default VerifyEmailService
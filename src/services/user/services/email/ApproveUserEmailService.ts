import { EmailApprovalSql } from "../../../../classes/DTOs/EmailApproval"

import ClientService from "../../../../classes/service/ClientService"

import IsUndNull from "../../../../functions/IsUndNull"
import Send from "../../../../classes/system/Send"
import SqlInjectionVerifier from "../../../../functions/SQL/SqlInjectionVerifier"
import ResponseMessage from "../../../../classes/DTOs/ResponseMessage"
import HttpStatusEnum from "../../../../enums/system/HttpStatusEnum"

class ApproveUserEmailService extends ClientService
{
    Action = "Aprovação de email de usuário."

    CheckBody() { throw new Error("Method not implemented.") }

    CheckQuery()
    : { email : string, userId : number }
    {
        const query = this.REQ.query as any

        if (IsUndNull(query.email))
        {
            ResponseMessage.SendNullField(["email"], this.Action, this.RES)
            throw new Error("Email de usuário não encontrado na requisição.")
        }

        if (IsUndNull(query.userId))
        {
            ResponseMessage.SendNullField(["userId"], this.Action, this.RES)
            throw new Error("Id de usuário não encontrado na requisição.")
        }

        return { email : query.email, userId : query.userId }
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

            const userInfoApproval = this.CheckQuery()

            const {
                email,
                userId
            } = userInfoApproval

            SqlInjectionVerifier(email)
            SqlInjectionVerifier(String(userId))

            let query = 
            `
                SELECT *
                FROM email_approvals
                WHERE
                    email = '${ email }' AND
                    user_id = ${ userId } AND
                    created = (
                                SELECT max(created)
                                FROM email_approvals
                                WHERE user_id = ${ userId }
                            )
            `

            const emailApproval = await DB_connection.query(query)
                .then(result => {
                    if (result.rowCount == 0)
                        throw new Error("Nenhum pedido de aprovação para esse email foi encontrado.")

                    const emailApproval = new EmailApprovalSql(result.rows[0])

                    if (emailApproval.Approved)
                        throw new Error("Email já aprovado.")

                    // Removido validação de usuário requeridor diferente de usuário a ser aprovado.
                    // Leva-se em conta que este endpoint pode ser acessado externamente.

                    return emailApproval
                })
                .catch(ex => { throw new Error(ex.message) })

            query = `CALL approve_user_email(${ emailApproval.UserId }, ${ emailApproval.Id })`

            await DB_connection.query(query)
                .then(() => {})
                .catch(ex => {
                    throw new Error(ex.message)
                })

            ResponseMessage.Send(
                HttpStatusEnum.OK,
                "Email aprovado com sucesso!",
                Action,
                RES
            )
        }
        catch (ex)
        {
            ResponseMessage.Send(
                HttpStatusEnum.INTERNAL_SERVER_ERROR,
                `Houve um erro ao aprovar o email. Erro: ${ (ex as Error).message }`,
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

export default ApproveUserEmailService
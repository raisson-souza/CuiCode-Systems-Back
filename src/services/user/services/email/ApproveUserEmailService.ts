import EmailApproval from "../../../../classes/entities/email/EmailApproval"

import ClientService from "../../../../classes/service/ClientService"
import Exception from "../../../../classes/custom/Exception"
import ResponseMessage from "../../../../classes/system/ResponseMessage"

import IsUndNull from "../../../../functions/logic/IsUndNull"
import SqlInjectionVerifier from "../../../../functions/SQL/SqlInjectionVerifier"

import HttpStatusEnum from "../../../../enums/system/HttpStatusEnum"

class ApproveUserEmailService extends ClientService
{
    Action = "Aprovação de email de usuário."

    CheckBody() { throw new Error("Method not implemented.") }

    CheckQuery()
    : { email : string, userId : number }
    {
        const query = this.REQ.query as any

        if (IsUndNull(query.email)) {
            ResponseMessage.SendNullField({
                expressResponse: this.RES,
                fields: ["email"],
                log: this.Action
            })
        }

        if (IsUndNull(query.userId)) {
            ResponseMessage.SendNullField({
                expressResponse: this.RES,
                fields: ["userId"],
                log: this.Action
            })
        }

        return { email : query.email, userId : query.userId }
    }

    CheckParams() { }

    async Operation()
    {
        try
        {
            const {
                DB_connection,
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

                    const emailApproval = new EmailApproval(result.rows[0])

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

            ResponseMessage.Send({
                status: HttpStatusEnum.OK,
                data: "Email aprovado com sucesso!",
                log: this.Action,
                expressResponse: this.RES
            })
        }
        catch (ex)
        {
            ResponseMessage.Send({
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR,
                data: `Houve um erro ao aprovar o email. Erro: ${ (ex as Error).message }`,
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

export default ApproveUserEmailService
import { EmailApprovalSql } from "../../../../classes/EmailApproval"
import Service from "../../../../classes/Service"

import IsUndNull from "../../../../functions/IsUndNull"
import Send from "../../../../functions/system/Send"
import SqlInjectionVerifier from "../../../../functions/SQL/SqlInjectionVerifier"

class ApproveUserEmailService extends Service
{
    Action = "Aprovação de email de usuário."

    CheckQuery(query : any)
    : { email : string, userId : number }
    {
        if (IsUndNull(query.email))
            throw new Error("Email de usuário não encontrado na requisição.")

        if (IsUndNull(query.userId))
            throw new Error("Id de usuário não encontrado na requisição.")

        return { email : query.email, userId : query.userId }
    }

    async Operation()
    {
        try
        {
            const {
                REQ,
                RES,
                DB_connection,
                Action
            } = this

            const userInfoApproval = this.CheckQuery(REQ.query)

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
                    created = (SELECT max(created) FROM email_approvals)
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

            Send.Ok(RES, "Email aprovado com sucesso!", Action)
        }
        catch (ex)
        {
            Send.Error(this.RES, `Houve um erro ao aprovar o email. Erro: ${ (ex as Error).message }`, this.Action)
        }
        finally
        {
            this.DB_connection.end()
        }
    }
}

export default ApproveUserEmailService
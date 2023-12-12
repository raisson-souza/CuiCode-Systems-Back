import Service from "../../../../classes/Service"
import { EmailApprovalSql } from "../../../../classes/EmailApproval"

import IsUndNull from "../../../../functions/IsUndNull"
import Send from "../../../../functions/Responses"
import SqlInjectionVerifier from "../../../../functions/SQL/SqlInjectionVerifier"
import EmailSender from "../../../../functions/system/EmailSender"

import EmailTitles from "../../../../enums/EmailTitlesEnum"

class ApproveUserEmailService extends Service
{
    Action = "Aprovação de email de usuário"

    CheckQuery(query : any)
    {
        if (IsUndNull(query.email))
            throw new Error("Email de usuário não encontrado na requisição.")

        return query.email as string
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

            await this.SetReqUserAsync()

            const toApproveEmail = this.CheckQuery(REQ.query)

            SqlInjectionVerifier(toApproveEmail)

            const selectEmailQuery = 
            `
                SELECT *
                FROM email_approvals
                WHERE
                    email = '${ toApproveEmail }' AND
                    user_id = ${ this.USER_req?.Id } AND
                    created = (SELECT max(created) FROM email_approvals)
            `

            const emailApproval = await DB_connection.query(selectEmailQuery)
                .then(result => {
                    if (result.rowCount == 0)
                        throw new Error("Nenhum pedido de aprovação para esse email foi encontrado.")

                    const emailApproval = new EmailApprovalSql(result.rows[0])

                    if (emailApproval.Approved)
                        throw new Error("Email já aprovado.")

                    if (this.USER_req?.Id != emailApproval.UserId)
                    {
                        new EmailSender()
                            .Internal(
                                EmailTitles.DIFFERENT_USER_ON_EMAIL_APPROVAL,
                                `Usuário ${ this.USER_req?.GenerateUserKey() } tentou aprovar o email ${ emailApproval.Email } pertencente ao usuário ${ emailApproval.Id }.`
                            )
                        throw new Error("Você não pode realizar essa aprovação.")
                    }

                    return emailApproval
                })
                .catch(ex => { throw new Error(ex.message) })

            // A partir daqui é garantido que o usuário requeridor é quem está tentando aprovar o email.

            const approveEmailQuery = `CALL approve_user_email(${ emailApproval.UserId }, ${ emailApproval.Id })`

            await DB_connection.query(approveEmailQuery)
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
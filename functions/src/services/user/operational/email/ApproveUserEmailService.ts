import { EmailApprovalSql } from "../../../../classes/EmailApproval"
import Service from "../../../../classes/Service"

import IsUndNull from "../../../../functions/IsUndNull"
import Send from "../../../../functions/Responses"
import SqlInjectionVerifier from "../../../../functions/SQL/SqlInjectionVerifier"
import EmailSender from "../../../../functions/system/EmailSender"

import EmailTitles from "../../../../enums/EmailTitlesEnum"

export default async function ApproveUserEmailService
(
    service : Service
)
: Promise<void>
{
    const action = "Aprovação de email de usuário"

    try
    {
        const {
            REQ,
            RES,
            DB_connection,
            DB_stage,
        } = service

        if (REQ.method != "GET")
            return Send.MethodNotAllowed(RES, "Método não autorizado.", action)

        await service.SetReqUserAsync()

        const toApproveEmail = CheckQuery(REQ.query)

        SqlInjectionVerifier(toApproveEmail)

        const selectEmailQuery = 
        `
            SELECT *
            FROM ${ DB_stage }.email_approvals
            WHERE
                email = '${ toApproveEmail }' AND
                user_id = ${ service.USER_req?.Id } AND
                created = (SELECT max(created) FROM ${ DB_stage }.email_approvals)
        `

        const emailApproval = await DB_connection.query(selectEmailQuery)
            .then(result => {
                if (result.rowCount == 0)
                    throw new Error("Nenhum pedido de aprovação para esse email foi encontrado.")

                const emailApproval = new EmailApprovalSql(result.rows[0])

                if (emailApproval.Approved)
                    throw new Error("Email já aprovado.")

                if (service.USER_req?.Id != emailApproval.UserId)
                {
                    new EmailSender().Internal(EmailTitles.DIFFERENT_USER_ON_EMAIL_APPROVAL, `Usuário ${ service.USER_req?.GenerateUserKey() } tentou aprovar o email ${ emailApproval.Email } pertencente ao usuário ${ emailApproval.Id }.`)
                    throw new Error("Você não pode realizar essa aprovação.")
                }

                return emailApproval
            })
            .catch(ex => { throw new Error(ex.message) })

        // A partir daqui é garantido que o usuário requeridor é quem está tentando aprovar o email.

        const approveEmailQuery = `CALL ${ DB_stage }.approve_user_email('${ DB_stage }', ${ emailApproval.UserId }, ${ emailApproval.Id })`

        await DB_connection.query(approveEmailQuery)
            .then(() => {})
            .catch(ex => {
                throw new Error(ex.message)
            })

        Send.Ok(RES, "Email aprovado com sucesso!", action)
    }
    catch (ex)
    {
        Send.Error(service.RES, `Houve um erro ao aprovar o email. Erro: ${ (ex as Error).message }`, action)
    }
    finally
    {
        service.DB_connection.end()
    }
}

function CheckQuery(query : any)
{
    if (IsUndNull(query.email))
        throw new Error("Email de usuário não encontrado na requisição.")

    return query.email as string
}

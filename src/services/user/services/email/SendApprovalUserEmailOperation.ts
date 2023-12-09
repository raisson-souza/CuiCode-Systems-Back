import { Client } from "pg"

import User from "../../../../classes/User"

import EmailSender from "../../../../functions/system/EmailSender"
import IsUndNull from "../../../../functions/IsUndNull"
import QueryDbRowByProperty from "../../../../functions/SQL/QueryDbRowByProperty"

import EmailTitles from "../../../../enums/EmailTitlesEnum"

export default async function SendApprovalEmailOperation
(
    user : User,
    db_connection : Client,
    is_creation : boolean = false
)
{
    if (is_creation || IsUndNull(user.Id))
        user.Id = await QueryDbRowByProperty(db_connection, "users", "username", user.Username, "id")

    const createEmailApprovalQuery =
    `
        INSERT INTO email_approvals (user_id, email, approved)
        VALUES
        (
            ${ user.Id },
            '${ user.Email }',
            false
        )
    `

    const saudation = `Olá ${ user.Name }, bem vindo(a) a CuiCodeSystems!`

    return await db_connection.query(createEmailApprovalQuery)
        .then(() => {
            const emailBody = `${ saudation } Acesse esse link para aprovar seu email no ERP:\n${ GeneratEndpoint(user.Id, user.Email) }.`

            new EmailSender().External(EmailTitles.EMAIL_APPROVAL_REQUEST, emailBody, user.Email)

            return true
        })
        .catch(ex => {
            const emailBody = `${ saudation } Houve um erro ao criar o seu pedido de aprovação de email, por favor realize a operação novamente manualmente no ERP:\n${ GeneratEndpoint(user.Id, user.Email) }.`

            new EmailSender().External(EmailTitles.EMAIL_APPROVAL_REQUEST, emailBody, user.Email)

            new EmailSender().Internal(EmailTitles.EMAIL_APPROVAL_ERROR, (ex as Error).message)

            return false
        })
}

function GeneratEndpoint(id : number, email : string)
{
    return `http://localhost:3000/email/approval?UserReqId=${ id }&email=${ email }`
}

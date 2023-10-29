import { Client } from "pg"

import User from "../../../../classes/User"

import EmailSender from "../../../../functions/system/EmailSender"
import IsUndNull from "../../../../functions/IsUndNull"
import QueryDbRowByProperty from "../../../../functions/SQL/QueryDbRowByProperty"

import EmailTitles from "../../../../enums/EmailTitlesEnum"

export default async function SendApprovalEmailOperation
(
    user : User,
    db_stage : any,
    db_connection : Client,
    is_creation : boolean = false
)
{
    if (is_creation || IsUndNull(user.Id))
        user.Id = await QueryDbRowByProperty(db_connection, db_stage, "users", "username", user.Username, "id")

    const createEmailApprovalQuery =
    `
        INSERT INTO ${ db_stage }.email_approvals (user_id, email, approved)
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
            const emailBody = `${ saudation } Acesse esse link para aprovar seu email no ERP:\n${ GeneratEndpoint(db_stage, user.Id, user.Email) }.`

            new EmailSender().External(EmailTitles.EMAIL_APPROVAL_REQUEST, emailBody, user.Email)

            return true
        })
        .catch(ex => {
            const emailBody = `${ saudation } Houve um erro ao criar o seu pedido de aprovação de email, por favor realize a operação novamente manualmente no ERP:\n${ GeneratEndpoint(db_stage, user.Id, user.Email) }.`

            new EmailSender().External(EmailTitles.EMAIL_APPROVAL_REQUEST, emailBody, user.Email)

            new EmailSender().Internal(EmailTitles.EMAIL_APPROVAL_ERROR, (ex as Error).message)

            return false
        })
}

function GeneratEndpoint(db_stage : string, id : number, email : string)
{
    let url = ""

    switch (db_stage)
    {
        case "production":
            url += ""
            break
        case "staging":
            url += ""
            break
        case "testing":
            url += `http://127.0.0.1:5001/cuicode-systems/us-central1/ApproveUserEmail`
            break
        default:
            url += `http://127.0.0.1:5001/cuicode-systems/us-central1/ApproveUserEmail`
    }

    return url + `?UserReqId=${ id }&email=${ email }`
}
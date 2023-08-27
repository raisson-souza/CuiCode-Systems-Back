import HERMES from "../../../functions/HERMES"

import HermesTitle from "../../../../enums/HermesTitle"

import User from "../../../../classes/User"

import { Client } from "pg"

export default async function SendApprovalEmailOperation
(
    user : User,
    db_stage : any,
    db_connection : Client
)
{
    const saudations = `Olá ${ user.Name }, bem vindo(a) a CuiCodeSystems!`

    new HERMES().SendInternalEmail(HermesTitle.NEW_USER, user.GenerateUserKey())

    user.Id = await db_connection.query(`SELECT id FROM ${ db_stage }.users WHERE email = '${ user.Email }'`)
        .then(result => { return result.rows[0]["id"] })
        .catch(ex => { throw new Error(ex.message) })

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

    return await db_connection.query(createEmailApprovalQuery)
        .then(() => {
            const emailBody = `${ saudations } Acesse esse link para aprovar seu email no ERP:\n${ GeneratEndpoint(db_stage, user.Id, user.Email) }.`

            new HERMES().SendExternalEmail(HermesTitle.EMAIL_APPROVAL_REQUEST, emailBody, user.Email)

            return true
        })
        .catch(ex => {
            const emailBody = `${ saudations } Houve um erro ao criar o seu pedido de aprovação de email, por favor realize a operação novamente manualmente no ERP:\n${ GeneratEndpoint(db_stage, user.Id, user.Email) }.`

            new HERMES().SendExternalEmail(HermesTitle.EMAIL_APPROVAL_REQUEST, emailBody, user.Email)

            new HERMES().SendInternalEmail(HermesTitle.EMAIL_APPROVAL_ERROR, (ex as Error).message)

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

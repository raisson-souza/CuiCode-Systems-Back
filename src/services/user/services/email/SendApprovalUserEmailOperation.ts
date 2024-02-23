import Env from "../../../../config/Env"

import Operation from "../../../../classes/service/base/Operation"

import EmailSender from "../../../../classes/entities/email/EmailSender"
import IsUndNull from "../../../../functions/logic/IsUndNull"
import QueryDbRowByProperty from "../../../../functions/SQL/QueryDbRowByProperty"

import EmailTitles from "../../../../enums/EmailTitlesEnum"

class SendApprovalEmailOperation extends Operation
{
    async PerformOperation(is_creation : boolean = false)
    {
        const {
            User,
            DB_connection
        } = this

        if (is_creation || IsUndNull(User!.Id))
            User!.Id = await QueryDbRowByProperty(DB_connection, "users", "username", User!.Username, "id")

        const createEmailApprovalQuery =
        `
            INSERT INTO email_approvals (user_id, email, approved)
            VALUES
            (
                ${ User!.Id },
                '${ User!.Email }',
                false
            )
        `

        const saudation = `Olá ${ User!.Name }, bem vindo(a) a CuiCodeSystems!`

        return await DB_connection.query(createEmailApprovalQuery)
            .then(() => {
                const emailBody = `${ saudation } Acesse esse link para aprovar seu email no ERP:\n${ this.GenerateEndpoint(User!.Id, User!.Email) }.`

                EmailSender.External(EmailTitles.EMAIL_APPROVAL_REQUEST, emailBody, User!.Email)

                return true
            })
            .catch(ex => {
                let emailBody = `${ saudation } Houve um erro ao criar o seu pedido de aprovação de email, por favor realize a operação novamente manualmente no ERP:\n`
                emailBody += `${ Env.FrontBase }/userProfile`

                EmailSender.External(EmailTitles.EMAIL_APPROVAL_REQUEST, emailBody, User!.Email)

                EmailSender.Internal(EmailTitles.EMAIL_APPROVAL_ERROR, (ex as Error).message)

                return false
            })
        }

        private GenerateEndpoint(id : number, email : string)
        {
            return `${ Env.BackBase }/email/approval?userId=${ id }&email=${ email }`
        }
}

export default SendApprovalEmailOperation
import env from "../../config/Env"

import EmailSender from "../../classes/entities/email/EmailSender"

import IsNil from "../../functions/logic/IsNil"
import QueryDbRowByProperty from "../../functions/SQL/QueryDbRowByProperty"
import ToBase64 from "../../functions/formatting/ToBase64"

import EmailTitlesEnum from "../../enums/EmailTitlesEnum"

import {
    AccountRecoveryProps,
    ApproveEmailProps,
    ConfirmAccountRecoveryProps,
    SendEmailApprovalProps,
    VerifyEmailProps,
} from "./types/UsersAccountServiceProps"

export default class UsersAccountService
{
    /** Recupera a conta de um usuário. */
    static async AccountRecovery(props : AccountRecoveryProps) : Promise<void>
    {

    }

    /** Confirma a recuperação de conta de um usuário. */
    static async ConfirmAccountRecovery(props : ConfirmAccountRecoveryProps) : Promise<void>
    {

    }

    /** Verifica o email de um usuário. */
    static async VerifyEmail(props : VerifyEmailProps) : Promise<void>
    {

    }

    /** Aprova o email de um usuário. */
    static async ApproveEmail(props : ApproveEmailProps) : Promise<void>
    {

    }

    /** Envia aprovação de email. */
    static async SendEmailApproval(props : SendEmailApprovalProps) : Promise<boolean>
    {
        const { isCreation, user } = props

        if (isCreation || IsNil(user.Id))
        {
            user.Id = await QueryDbRowByProperty(
                props.Db.PostgresDb,
                "users",
                "username",
                user.Username,
                "id"
            )
        }

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

        const defineGreetingMessage = () => {
            switch (user.Sex?.Value)
            {
                case 1:
                    return 'bem vindo'
                case 2:
                    return 'bem vinda'
                default:
                    return 'bem vindo(a)'
            }
        }

        const saudation = `Olá ${ user.Name }, ${ defineGreetingMessage() } a CuiCodeSystems!`
        const endpoint = `${ env.BackBaseUrl() }/email/approval?userId=${ user.Id }&email=${ user.Email }`

        return await props.Db.PostgresDb.query(createEmailApprovalQuery)
            .then(() => {
                const emailBody = `${ saudation }\nAcesse esse link para aprovar seu email no sistema:\n${ endpoint }.`

                EmailSender.External(EmailTitlesEnum.EMAIL_APPROVAL_REQUEST, emailBody, user.Email)

                return true
            })
            .catch(ex => {
                let emailBody = `${ saudation }\nHouve um erro ao criar o seu pedido de aprovação de email, por favor realize a operação novamente manualmente no sistema:\n`
                emailBody += `${ env.FrontBaseUrl() }/users/${ ToBase64(user.Id) }`

                EmailSender.External(EmailTitlesEnum.EMAIL_APPROVAL_REQUEST, emailBody, user.Email)

                EmailSender.Internal(EmailTitlesEnum.EMAIL_APPROVAL_ERROR, (ex as Error).message)

                return false
            })
    }
}
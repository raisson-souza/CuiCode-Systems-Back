import env from "../../config/Env"

import EmailApproval from "../../classes/entities/email/EmailApproval"
import EmailSender from "../../classes/entities/email/EmailSender"
import SqlFormatter from "../../classes/sql/SqlFormatter"
import User from "../../classes/entities/user/User"
import UsersService from "./UsersService"
import UsersValidator from "../../validators/UsersValidator"

import EncryptInfo from "../../functions/security/EncryptPassword"
import IsNil from "../../functions/logic/IsNil"
import QueryDbRowByProperty from "../../functions/SQL/QueryDbRowByProperty"
import ToBase64 from "../../functions/formatting/ToBase64"

import EmailTitlesEnum from "../../enums/EmailTitlesEnum"

import {
    AccountRecoveryProps,
    ApproveEmailProps,
    ConfirmAccountRecoveryProps,
    SendEmailApprovalProps,
    UpdatePasswordProps,
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

    /** Aprova o email de um usuário. */
    static async ApproveEmail(props : ApproveEmailProps) : Promise<void>
    {
        const { userId, userEmail } = props

        SqlFormatter.SqlInjectionVerifier([userEmail])

        let query = 
        `
            SELECT *
            FROM email_approvals
            WHERE
                email = '${ userEmail }' AND
                user_id = ${ userId } AND
                created = (
                    SELECT max(created)
                    FROM email_approvals
                    WHERE user_id = ${ userId }
                )
        `

        const emailApproval = await props.Db.PostgresDb.query(query)
            .then(result => {
                if (result.rowCount == 0)
                    throw new Error("Nenhum pedido de aprovação para esse email foi encontrado.")

                const emailApproval = new EmailApproval(result.rows[0])

                if (emailApproval.Approved)
                    throw new Error("Email já aprovado.")

                return emailApproval
            })
            .catch(ex => { throw new Error(ex.message) })

        // Chamada procedure para conclusão de aprovação do email no usuário
        query = `CALL approve_user_email(${ emailApproval.UserId }, ${ emailApproval.Id })`

        await props.Db.PostgresDb.query(query)
            .then(() => {})
            .catch(ex => {
                throw new Error(ex.message)
            })
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
        const endpoint = `${ env.BackBaseUrl() }/users/account/email/approve?user_id=${ user.Id }&email=${ user.Email }`

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

    /** Atualiza a senha e dica de senha de um usuário. */
    static async UpdatePassword(props : UpdatePasswordProps) : Promise<void>
    {
        const { userId, password, passwordHint, modifiedBy, isAdmChange } = props

        SqlFormatter.SqlInjectionVerifier([password, passwordHint])
        UsersValidator.ValidatePassword(password)
        UsersValidator.ValidatePasswordHint(password, passwordHint)

        const oldUser = await UsersService.Get({
            Db: props.Db,
            userId: userId
        })

        const query = `UPDATE users SET password = '${ EncryptInfo(password) }', password_hint = '${ passwordHint }', modified = now(), modified_by = ${ modifiedBy } WHERE id = '${ userId }' RETURNING *`

        const newUser = await props.Db.PostgresDb.query(query)
            .then(result => {
                return new User(result.rows[0])
            })
            .catch(ex => { throw new Error(ex.message) })

        await UsersService.UpdateLog({
            Db: props.Db,
            isAdmChange: isAdmChange,
            modifiedBy: modifiedBy,
            oldUser: oldUser,
            newUser: newUser,
            userId: userId
        })
    }
}
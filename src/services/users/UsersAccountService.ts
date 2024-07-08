import Env from "../../config/Env"

import EmailApproval from "../../classes/entities/email/EmailApproval"
import EmailSender from "../../classes/entities/email/EmailSender"
import SqlFormatter from "../../classes/sql/SqlFormatter"
import User from "../../classes/entities/user/User"
import UsersAccountRecoveryService from "./UsersAccountRecoveryService"
import UsersService from "./UsersService"
import UsersValidator from "../../validators/UsersValidator"

import EncryptInfo from "../../functions/security/EncryptPassword"
import IsJwtExpired from "../../functions/math/IsTimeExpired"
import IsNil from "../../functions/logic/IsNil"
import ToBase64 from "../../functions/formatting/ToBase64"

import EmailTitlesEnum from "../../enums/EmailTitlesEnum"

import {
    AccountRecoveryProps,
    ApproveEmailProps,
    ConfirmAccountRecoveryProps,
    MassAccountRecoveryExpireProps,
    SendAccountRecoveryEmailProps,
    SendEmailApprovalProps,
    UpdatePasswordProps,
    VerifyAccountRecoveryProps,
} from "./types/UsersAccountServiceProps"

export default class UsersAccountService
{
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
            const query = `SELECT id FROM users WHERE username = '${ user.Username }'`
            
            await props.Db.PostgresDb.query(query)
                .then(result => {
                    user.Id = result.rows[0]["id"]
                })
                .catch(ex => { throw new Error(ex.message) })
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
        const endpoint = `${ Env.BackBaseUrl() }/users/account/email/approve?user_id=${ user.Id }&email=${ user.Email }`

        return await props.Db.PostgresDb.query(createEmailApprovalQuery)
            .then(() => {
                const emailBody = `${ saudation }\nAcesse esse link para aprovar seu email no sistema:\n${ endpoint }.`

                EmailSender.External(EmailTitlesEnum.EMAIL_APPROVAL_REQUEST, emailBody, user.Email)

                return true
            })
            .catch(ex => {
                let emailBody = `${ saudation }\nHouve um erro ao criar o seu pedido de aprovação de email, por favor realize a operação novamente manualmente no sistema:\n`
                emailBody += `${ Env.FrontBaseUrl() }/users/${ ToBase64(user.Id) }`

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

    /** Recupera a conta de um usuário. */
    static async AccountRecovery(props : AccountRecoveryProps) : Promise<void>
    {
        const { email } = props

        const queryUserByEmail = `SELECT * FROM users WHERE email = '${ email }'`

        const user = await props.Db.PostgresDb.query(queryUserByEmail)
            .then(result => {
                return new User(result.rows[0])
            })
            .catch(ex => { throw new Error(ex.message) })

        const usersAccountRestorations = await UsersAccountRecoveryService.GetByUserId({
            Db: props.Db,
            userId: user.Id
        })

        if (usersAccountRestorations.length > 0)
        {
            await this.MassAccountRecoveryExpire({
                Db: props.Db,
                accountRestorations: usersAccountRestorations
            })

            const activeUsersAccountRestoration = usersAccountRestorations.filter(usersAccountRestoration => {
                return usersAccountRestoration.Expired == false && usersAccountRestoration.Completed == false
            })[0]

            if (!IsNil(activeUsersAccountRestoration))
            {
                // Caso exista uma solicitação de recuperação de conta ativa ainda, o email é reenviado.
                this.SendAccountRecoveryEmail({
                    jwt: activeUsersAccountRestoration.Jwt!,
                    user: user
                })
                throw new Error("Já existe uma solicitação de recuperação ativa para esta conta")
            }
        }

        const userAccountRestoration = await UsersAccountRecoveryService.Create({
            Db: props.Db,
            email: email,
            userId: user.Id
        })

        this.SendAccountRecoveryEmail({
            jwt: userAccountRestoration.Jwt!,
            user: user
        })
    }

    /** Envia email de restauração de conta. */
    private static SendAccountRecoveryEmail(props : SendAccountRecoveryEmailProps) : void
    {
        const { user, jwt } = props
        let text = `
            Uma restauração de conta foi solicitada para seu usuário ${ user.GenerateUserKey() }.\n
            Por favor, acesse esta URL para recuperar sua conta:\n${ Env.FrontBaseUrl() }/users/account/recovery?jwt=${ jwt }\n
            Caso esta operação não tenha sido solicitada por você, por favor, desconsidere.
        `
        text = text.trim()

        EmailSender.External(
            EmailTitlesEnum.USER_ACCOUNT_RESTORATION,
            text,
            user.Email
        )

        EmailSender.Internal(
            EmailTitlesEnum.USER_ACCOUNT_RESTORATION,
            `Solicitação de recuperação de conta para ${ user.GenerateUserKey() } realizada.`
        )
    }

    /** Confirma a recuperação de conta de um usuário. */
    static async ConfirmAccountRecovery(props : ConfirmAccountRecoveryProps) : Promise<void>
    {
        const { userNewPassword, userNewPasswordHint, recoveryJwt } = props

        const userAccountRecoveries = await UsersAccountRecoveryService.GetByJwt({
            Db: props.Db,
            jwt: recoveryJwt
        })

        await this.MassAccountRecoveryExpire({
            Db: props.Db,
            accountRestorations: userAccountRecoveries
        })

        const activeAccountRecovery = userAccountRecoveries.filter(accountRecovery => {
            return !accountRecovery.Completed && !accountRecovery.Expired
        })[0]

        if (IsNil(activeAccountRecovery))
            throw new Error("Nenhuma solicitação de restauração de conta ativa foi encontrada, verifique o token ou realize o processo novamente.")

        UsersValidator.ValidatePassword(userNewPassword)
        UsersValidator.ValidatePasswordHint(userNewPassword, userNewPasswordHint)

        const user = await UsersService.Get({
            Db: props.Db,
            userId: activeAccountRecovery.UserId,
        })

        const newUser = new User({ ...user })
        newUser.Password = EncryptInfo(userNewPassword)
        newUser.PasswordHint = userNewPasswordHint

        const query = `UPDATE users SET password = '${ newUser.Password }', password_hint = '${ newUser.PasswordHint }', modified = now(), modified_by = NULL WHERE id = ${ user.Id }`

        await props.Db.PostgresDb.query(query)
            .then(() => {})
            .catch(ex => { throw new Error(ex.message) })

        await UsersService.UpdateLog({
            Db: props.Db,
            userId: user.Id,
            oldUser: user,
            newUser: newUser,
            modifiedBy: user.Id,
            isAdmChange: false
        })

        await UsersAccountRecoveryService.Complete({
            Db: props.Db,
            recoveryId: activeAccountRecovery.Id
        })
    }

    /** Realizará a expiração das solicitações já expiradas. */
    private static async MassAccountRecoveryExpire(props : MassAccountRecoveryExpireProps) : Promise<void>
    {
        const { accountRestorations } = props

        const mapPromise = accountRestorations.map(async (usersAccountRestoration, i) => {
            if (IsJwtExpired(usersAccountRestoration.Jwt!) && !usersAccountRestoration.Expired)
            {
                await UsersAccountRecoveryService.Expire({
                    Db: props.Db,
                    recoveryId: usersAccountRestoration.Id
                })
                accountRestorations[i].Expired = true
                accountRestorations[i].Completed = true
            }
        })

        await Promise.all(mapPromise)
    }

    /** Verifica se solicitação de recuperação de conta existe. */
    static async VerifyAccountRecovery(props : VerifyAccountRecoveryProps) : Promise<void>
    {

    }
}
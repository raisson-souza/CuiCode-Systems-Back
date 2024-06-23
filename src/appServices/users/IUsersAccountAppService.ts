export default interface IUsersAccountAppService
{
    /** Aprovação de email de usuário */
    ApproveEmail() : void
    /** Envia aprovação de email para email de usuário */
    SendEmailApproval() : void
    /** Recuperação de conta de usuário. */
    AccountRecovery() : void
    /** Confirmação de recuperação de conta de usuário. */
    ConfirmAccountRecovery() : void
}
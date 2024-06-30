export default interface IUsersAccountAppService
{
    /** Aprovação de email de usuário */
    ApproveEmail() : void
    /** Envia aprovação de email para email de usuário */
    SendEmailApproval() : void
    /** Inicio do processo de recuperação de conta de usuário. */
    AccountRecovery() : void
    /** Confirmação do processo de recuperação de conta de usuário. */
    ConfirmAccountRecovery() : void
    /** Verifica se solicitação de recuperação de conta existe. */
    VerifyAccountRecovery() : void
    /** Atualiza a senha do usuário. */
    UpdatePassword() : void
}
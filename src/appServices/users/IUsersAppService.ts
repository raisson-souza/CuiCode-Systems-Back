export default interface IUsersAppService
{
    // ESCOPO BASE USUÁRIO
    /** Criação de usuário. */
    CreateUser() : void
    /** Edição de usuário. */
    UpdateUser() : void
    /** Inativação de usuário. */
    InactivateUser() : void
    /** Captura de usuário. */
    GetUser() : void
    /** Captura de foto de usuário. */
    GetUserPhoto() : void
    /** Registro de foto de usuário. */
    RegistryUserPhoto() : void
    /** Listagem de usuários. */
    ListUsers() : void
    /** Captura de informações diárias do usuário. */
    DailyInfo() : void
    /** Captura dos logs do usuário. */
    GetUserLogs() : void
    /** Atualização da senha do usuário. */
    UpdatePassword() : void

    // ESCOPO CONTA DE USUÁRIO
    /** Recuperação de conta de usuário. */
    AccountRecovery() : void
    /** Confirmação de recuperação de conta de usuário. */
    ConfirmAccountRecovery() : void
    /** Verificação de email de usuário. */
    VerifyEmail() : void
    /** Aprovação de email de usuário */
    ApproveUserEmail() : void
}
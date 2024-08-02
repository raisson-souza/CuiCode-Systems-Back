export default interface ISystemAppService
{
    /** Verifica se o sistema está em pleno funcionamento. */
    OkSystem() : void
    /** Captura o estilo de sistema atual do front-end. */
    SystemStyle() : void
    /** Desativa todos os processo de um módulo. */
    DeactivateModule() : void
    /** Captura as credenciais do sistema. */
    GetCredentials() : void
    /** Coloca o sistema em manutenção. */
    SystemUnderMaintence() : void
    /** Captura um formulário. */
    GetForm() : void
    /** Captura o último usuário registrado no sistema. */
    GetLastRegisteredUser() : void
}
export default interface IAuthAppService
{
    /** Realiza o login do usuário. */
    Login() : void
    /** Realiza o refresh do token JWT. */
    RefreshToken() : void
    /** Captura os módulos autorizados ao usuário. */
    UserAuthorizedModules() : void
} 
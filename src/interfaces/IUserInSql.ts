/**
 * Index signature para aceitar qualquer propriedade de string.
 * Interface para proporcionar fácil acesso por propriedade de string em objetos.
 */
interface IUserInSql {
    [key: string]: any
}

export default IUserInSql
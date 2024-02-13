enum PermissionLevelEnum
{
    /**
     * Usuário **ROOT** do sistema, permissão absoluta.
     */
    Root = 4,

    /**
     * Usuário **ADM** do sistema, permissões avançadas no sistema.
     */
    Adm = 3,

    /**
     * Usuário **MEMBRO** do sistema, permissões básicas.
     */
    Member = 2,

    /**
     * **DEPRECATED:** *Usuário CONVIDADO do sistema, nenhuma permissão.*
     */
    Guest = 1
}

export default PermissionLevelEnum
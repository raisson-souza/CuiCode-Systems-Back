enum UsersFilterEnum
{
    /**
     * Usuário ativos.
     */
    AllActive = 1,

    /**
     * Usuários deletados.
     */
    AllDeleted = 2,

    /**
     * Usuários inativos.
     */
    AllInactive = 3,

    /**
     * Usuários com email aprovado.
     */
    AllEmailApproved = 4,

    /**
     * Usuários com email não aprovado.
     */
    AllEmailUnnaproved = 5,

    /**
     * Usuários aniversariantes deste mês.
     */
    AllMonthBirthdays = 6,

    /**
     * Usuários Administradores.
     */
    AllAdms = 7,

    /**
     * Usuários Membros.
     */
    AllMembers = 8,

    /**
     * Usuários com foto.
     */
    AllWithPhoto = 9,

    /**
     * Usuários sem foto.
     */
    AllWithoutPhoto = 10,

    /**
     * Usuários mulheres.
     */
    AllWomen = 11,

    /**
     * Usuários homens.
     */
    AllMen = 12,
}

export default UsersFilterEnum
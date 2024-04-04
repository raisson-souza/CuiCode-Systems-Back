/** Módulos do Sistema */
enum ModulesEnum
{
    /** Módulo Usuários */
    Users,

    /** Módulo Grupos */
    Groups,

    /** Módulo Boards */
    Board,

    /** Módulo Morfeus - Sonhos */
    Morfeus,

    /** Módulo Chats */
    Chats,

    /** Módulo Solicitações */
    Solicitations,

    /** Módulo Operacional - Administrador */
    Operational,

    /** Módulo Cronos - Automação e Agendamento */
    Cron,

    /** Módulo Héstia - Gerenciamento do Lar e Afazeres */
    Hestia,

    /** Módulo Minerva - Gerenciamento do Desenvolvimento Pessoal */
    Minerva,

    /** Módulo Doação */
    Donation,

    /** Módulo CuiPoints - Moedas */
    CuiPoints,

    /** Módulo Anansi - Apostas (integração obrigatória com CuiPoints) */
    Anansi,

    /** Módulo Zeus - Jogos (integração opcional com CuiPoints) */
    Zeus,
}

export default ModulesEnum
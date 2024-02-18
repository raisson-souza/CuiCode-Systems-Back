enum UsersVisualizationEnum
{
    /**
     * Captura todas as informações de um usuário (sem foto).
     */
    Absolute = 1,

    /**
     * Captura foto e informações gerais.
     */
    Presentation = 2,

    /**
     * Captura informações gerais.
     */
    List = 3,

    /**
     * Captura informações básicas.
     */
    Resume = 4,

    /**
     * Captura foto e chave de identificação.
     */
    Queote = 5,

    /**
     * Captura chave de identificação.
     */
    QueoteWithoutPhoto = 6,
}

export default UsersVisualizationEnum
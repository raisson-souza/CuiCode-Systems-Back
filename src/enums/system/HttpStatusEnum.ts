enum HttpStatusEnum
{
    OK = 200,

    CREATED = 201,

    /**
     * Ação aceita pelo servidor e em processamento, resposta inesperada.
     */
    ACCEPTED = 202,

    /**
     * Erro no lado do cliente.
     */
    INVALID = 400,

    /**
     * Cliente não autenticado.
     */
    UNAUTHORIZED = 401,

    /**
     * Ação não permitida para cliente.
     */
    PROHIBITED = 403,

    NOT_FOUND = 404,

    INTERNAL_SERVER_ERROR = 500,

    /**
     * Ação não suportada pelo servidor.
     */
    NOT_IMPLEMENTED = 501,

    /**
     * Servidor indisponível.
     */
    UNAVAIALBLE = 503,
}

export default HttpStatusEnum
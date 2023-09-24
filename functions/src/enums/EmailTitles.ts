enum EmailTitles
{
    // SISTEMA
    CRITICAL_ERROR =  "ERRO CRÍTICO",
    SYSTEM_RISK = "SISTEMA EM RISCO",
    DIFFERENT_USER_ON_EMAIL_APPROVAL = "USUÁRIO REQUERIDOR DIFERENTE DO USUÁRIO COM EMAIL A APROVAR",
    EMAIL_APPROVAL_ERROR = "ERRO AO CRIAR APROVAÇÃO DE EMAIL",

    // AVISO
    NEW_CHAT = "NOVO CHAT NO BOARD",
    NEW_LIKE = "NOVO LIKE NO POST",
    NEW_COMMENT = "NOVO COMENTÁRIO NO POST",
    EMAIL_APPROVED = "EMAIL APROVADO",

    // REGISTRO
    NEW_USER = "NOVO USUÁRIO NO SISTEMA",
    TRACE_ACTION = "REGISTRO DE AÇÃO DE USUÁRIO",
    USER_DEACTIVATED = "USUÁRIO DESATIVADO",
    USER_DELETED = "USUÁRIO DELETADO",

    // DEMANDA AÇÃO
    USER_APPROVATION = "USUÁRIO NOVO A APROVAR",
    EMAIL_APPROVAL_REQUEST = "APROVAÇÃO DE EMAIL",
}

export default EmailTitles

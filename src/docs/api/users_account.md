# ENDPOINTS DE CONTA DE USUÁRIO

## APROVAÇÃO DE EMAIL
> GET

Url acessada externamente (ou internamente caso nova implementação)

URL = /users/account/email/approve?userId={ ID DE USUÁRIO }&email={ EMAIL DE USUÁRIO }

## ENVIO MANUAL DE APROVAÇÃO DE EMAIL
> POST
- Necessita autenticação (usuário).

URL = /users/account/email/send_approval

## EDIÇÃO DE SENHA DE USUÁRIO
> POST
- Necessita autenticação. 

URL = /users/account/password_update

BODY =
```json
{
    "user_id": 1,
    "password": "senha123",
    "password_hint": "dica_da_senha"
}
```

## BUSCA DE EMAIL (esqueci minha senha)
> GET

URL = /users/find_email?email={ EMAIL }

**RETORNA** Valor boleano quanto a existência do email.

## CONFIRMAÇÃO DE RECUPERAÇÃO DE CONTA (inicia o processo de recuperação)
> POST  

*URL = /user/account/recovery/confirm_restoration?email={ EMAIL } /*

## RECUPERAÇÃO DE CONTA (confirma o processo de recuperação)
> POST

*URL = /user/account/recovery/restore_account?jwt={ TOKEN } /*

**REQUEST**
```json
{
    "new_password": "senha123",
    "new_password_hint": "dica_da_senha"
}
```

## VALIDADOR DE SOLICITAÇÃO DE RECUPERAÇÃO DE CONTA (para rota de recuperação de conta frontend)
> GET  

*URL = /user/account/recovery/verify?jwt={ TOKEN } /*

**RESPONSE:**
```json
{
    "exists": true, // Solicitação existe
    "error": ""
}
{
    "exists": false, // Solicitação NÃO existe
    "error": "Solicitação de recuperação de conta inexistente, verifique o token."
}
{
    "exists": true, // Solicitação existe
    "error": "Solicitação de recuperação de conta expirada, tente novamente."
}
```
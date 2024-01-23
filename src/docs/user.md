# ENDPOINT DE USUÁRIO

## GET
> GET
- Necessita autenticação.

URL = /user?UserId={ ID DE USUÁRIO }  
URL = /user?UserId={ ID DE USUÁRIO }&SystemQueryLevel={ NÚMERO }

- Captura todos os dados do usuário:
    - Sistema em query 1;
    - Usuário ADMIN ou ROOT;
    - Usuário autenticado igual ao id procurado.
- Captura dados não sensíveis:
    - Sistema em query 2;
    - Qualquer usuário.

## POST
> POST

URL = /user  
BODY =
```
{
    "Username": "@fulano",
    "Name": "Fulano Ciclano",
    "BirthDate": "2000-01-01T00:00:00.000Z",
    "Email": "fulano.testes@gmail.com",
    "RecoveryEmail": "fulano.testes@email.recuperacao.com",
    "Phone": "(55) 1 9999-9999",
    "Password": "teste123",
    "PasswordHint": "dica_de_senha",
    "PhotoBase64": null,
    "Sex": 1
}
```
- Sex = 1 Homem | 2 Mulher

## PUT
> PUT
- Necessita autenticação.

URL = /user  
BODY =
```
{
    "Id": { ID DO USUÁRIO A SER EDITADO },
    "{ PROPRIEDADE DE USUÁRIO }": "{ VALOR }",
    { ... }
}
```

## LIST
> GET
- Necessita autenticação.

URL = /users?RequiredInfo=["{ PROPRIEDADE DE USUÁRIO }", { ... }]

- É necessário que as propriedades estejam no formato SQL.

## APROVAÇÃO DE EMAIL
> GET

URL = /email/approval?userId={ ID DE USUÁRIO }&email={ EMAIL DE USUÁRIO }

## ENVIO MANUAL DE APROVAÇÃO DE EMAIL
> POST
- Necessita autenticação.

URL = /email/approval/send  
BODY =
```
{
    "UserReqId": { ID DO USUÁRIO }
}
```

## LOG DE USUÁRIO
> GET
- Necessita autenticação.

URL = /user/logs?userId={ ID DE USUÁRIO }&initialDate={ DATA }&finalDate={ DATA }

- Formato de data: 2024-01-01 00:00:00.000
- initialDate e finalDate são opcionais.
    - Se apenas initialDate: Todos os logs APÓS essa data;
    - Se apenas finalDate: Todos os logs ANTES dessa data.
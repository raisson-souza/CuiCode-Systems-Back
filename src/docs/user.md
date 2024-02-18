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

## GET DE FOTO DE USUÁRIO
> GET
- Necessita autenticação.

URL = http://localhost:3000/user/{ ID DE USUÁRIO }/photo

## CADASTRO DE FOTO DE USUÁRIO
> POST | PUT
- Necessita autenticação.

URL = http://localhost:3000/user/{ ID DE USUÁRIO }/photo

BODY =
```
{
    "photo": { BASE 64 }
}
```

## LISTAGEM AVANÇADA DE USUÁRIOS
> GET
- Necessita autenticação.

URL = http://localhost:3000/users/list?FilterType={ INT }&VisualizationType={ INT }

**FilterType**  
Usuário ativos.
AllActive = 1

Usuários deletados.
AllDeleted = 2

Usuários inativos.
AllInactive = 3

Usuários com email aprovado.
AllEmailApproved = 4

Usuários com email não aprovado.
AllEmailUnnaproved = 5

Usuários aniversariantes deste mês.
AllMonthBirthdays = 6

Usuários Administradores.
AllAdms = 7

Usuários Membros.
AllMembers = 8

Usuários com foto.
AllWithPhoto = 9

Usuários sem foto.
AllWithoutPhoto = 10

Usuários mulheres.
AllWomen = 11

Usuários homens.
AllMen = 12

**VisualizationType**  
Captura todas as informações de um usuário (sem foto).
Absolute = 1

Captura foto e informações gerais.
Presentation = 2

Captura informações gerais.
List = 3

Captura informações básicas.
Resume = 4

Captura foto e chave de identificação.
Queote = 5

Captura chave de identificação.
QueoteWithoutPhoto = 6
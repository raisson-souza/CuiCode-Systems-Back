# ENDPOINT DE USUÁRIO

## GET
> GET
- Necessita autenticação.

URL = /user?id={ ID DE USUÁRIO }  

**RETORNA:**
```json
"Id": 13,
"Active": true,
"Deleted": false,
"Created": "2024-01-27T16:53:49.600Z",
"Modified": "2024-02-16T18:22:10.583Z",
"BirthDate": "2004-01-31T23:00:00.000Z",
"Email": "cuica@gmail.com",
"EmailAproved": true,
"ModifiedBy": 13,
"Name": "Cuica Caturrita",
"Password": "80177534a0c99a7e3645b52f2027a48b",
"PasswordHint": "dica_de_senha",
"PermissionLevel": {
    "Description": "Root",
    "Value": 4
},
"Phone": "(55) 1 9999-9999",
"PhotoBase64": null,
"RecoveryEmail": "cuica@email.recuperacao.com",
"Sex": {
    "Description": "Female",
    "Value": 2
},
"Username": "@cuica"
```

## POST
> POST

URL = /user  
BODY =
```json
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
	"Id": 1,
	"Active": true,
	"Deleted": false,
	"BirthDate": "2000-01-01T02:00:00.000Z",
	"Email": "email@gmail.com",
	"Name": "Nome",
	"PermissionLevel": 2,
	"Phone": "(55) 55 9999-9999",
	"PhotoBase64": null,
	"RecoveryEmail": "email@email.recuperacao.com",
	"Sex": 1,
	"Username": "@username"
}
```

## LIST
> GET
- Necessita autenticação.

URL = /users?RequiredInfo=["{ PROPRIEDADE DE USUÁRIO }", { ... }]

- É necessário que as propriedades estejam no formato SQL.

**RETORNA:**
```json
[
    {
        "id": 19,
        "username": "@Fulano",
        "email": "fulano@gmail.com"
    },
    {
        "id": 20,
        "username": "@Ciclano",
        "email": "ciclano@gmail.com"
    }
]
```

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

**RETORNA:**
```json
[
    {
        "id": 100,
        "change": {
            "password": [
                "0192023a7bbd73250516f069df18b500",
                "e7d80ffeefa212b7c5c55700e4f7193e"
            ],
            "password_hint": [
                "dica 01",
                "dica 02"
            ]
        },
        "date": "2024-02-15T14:20:50.791Z",
        "adm_change": false
    },
    {
        "id": 101,
        "change": {
            "name": [
                "Fulano Silva",
                "Fulano Silveira"
            ]
        },
        "date": "2024-02-15T14:24:44.181Z",
        "adm_change": true
    }
]
```

## GET DE FOTO DE USUÁRIO
> GET
- Necessita autenticação.

URL = /user/{ ID DE USUÁRIO }/photo

**Retorna** um base 64 da foto do usuário.

## CADASTRO DE FOTO DE USUÁRIO
> POST | PUT
- Necessita autenticação.

URL = /user/{ ID DE USUÁRIO }/photo

BODY =
```
{
    "photo": { BASE 64 }
}
```

## LISTAGEM AVANÇADA DE USUÁRIOS
> GET
- Necessita autenticação.

URL = /users/list?FilterType={ INT }&VisualizationType={ INT }

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

**Retorna** uma lista de usuários.

## EDIÇÃO DE SENHA DE USUÁRIO
> PUT
- Necessita autenticação.

URL = /user/{ ID DE USUÁRIO }/password

BODY =
```
{
    "password": { NOVA SENHA },
    "password_hint": { NOVA DICA DE SENHA }
}
```

## RECUPERAÇÃO DE CONTA

### VERIFICAÇÃO DE EMAIL
> GET

URL = /user/account/recovery/verify_email?email={ EMAIL }

### CONFIRMAÇÃO DE RECUPERAÇÃO DE CONTA
> POST

URL = /user/account/recovery/confirm_restoration?email={ EMAIL }

### RESTAURAÇÃO DE CONTA
> POST
- Necessita autenticação.

URL = /user/account/recovery/restore_account?jwt={ TOKEN }

BODY =
```
{
    "password": { NOVA SENHA },
    "password_hint": { NOVA DICA DE SENHA }
}
```

### INFORMAÇÕES DIÁRIAS DO USUÁRIO
> GET
- Necessita autenticação.

URL = /user/daily_info

**RETORNA:**
```json
{
    "groupsIncluded": [
        {
            "Id": 0,
            "Name": "Nome do grupo",
        }
    ],
    "mySolicitations": [
        {
            "Id": 0,
            "Name": "Nome da solicitação",
        }
    ],
    "myDelayedSolicitations": [
        {
            "Id": 0,
            "Name": "Nome da solicitação",
        }
    ],
    "userParticipatingChats": 1,
    "userDreams": 1,
    "hestiaTasksThisWeek": 1,
    "hestiaTasksPending": 1,
    "minervaOpenPlans": 1
}
```
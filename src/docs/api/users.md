# ENDPOINTS DE USUÁRIO

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
> Necessita autenticação (sistema).

*URL = /users?visualization=[ UsersVisualizationEnum ]&filter=[ UsersFilterEnum ]&limit=[ number ]*

**RESPONSE**
```json
{
    "data": User[],
    "pagination": {
        "records": 0,
        "limit": 20
    }
}
```

## LOG DE USUÁRIO
> GET
- Necessita autenticação (Usuário).

URL = /user/{ ID DE USUÁRIO }/logs?initialDate={ DATA }&finalDate={ DATA }

- Formato de data: 2024-01-01 00:00:00.000
- initialDate e finalDate são opcionais.
    - Se apenas initialDate: Todos os logs APÓS essa data;
    - Se apenas finalDate: Todos os logs ANTES dessa data.

**RETORNA:**
```json
[
    {
        "id": 1,
        "change": {
            "name": [
                "Fulano Silva",
                "Fulano Silveira"
            ]
        },
        "date": "2024-01-01T12:00:00.000Z",
        "adm_change": true
    }
]
```

## GET DE FOTO DE USUÁRIO
> GET
- Necessita autenticação (Usuário).

URL = /user/{ ID DE USUÁRIO }/photo

**Retorna** um base 64 da foto do usuário.

## CADASTRO DE FOTO DE USUÁRIO
> POST | PUT
- Necessita autenticação (Usuário).

URL = /user/{ ID DE USUÁRIO }/photo

BODY =
```
{
    "photo": { BASE 64 }
}
```

**Retorna** um base 64 da foto do usuário.

## INFORMAÇÕES DIÁRIAS DO USUÁRIO
> GET
- Necessita autenticação.

URL = /user/daily_info

**RETORNA:**
```json
{
    "groups": [
        {
            "Id": 0,
            "Name": "Nome do grupo",
        }
    ],
    "solicitations": [
        {
            "Id": 0,
            "Name": "Nome da solicitação",
        }
    ],
    "delayedSolicitations": [
        {
            "Id": 0,
            "Name": "Nome da solicitação",
        }
    ],
    "chatsNumber": 1,
    "dreamsNumber": 1,
    "hestiaTasksThisWeekNumber": 1,
    "hestiaPendingTasksNumber": 1,
    "minervaOpenPlans": 1
}
```
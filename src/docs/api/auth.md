# ENDPOINTS DE AUTENTICAÇÃO

## LOGIN
> POST

*URL = /auth/login*

**REQUEST**
```json
{
    "email": "fulano@gmail.com",
    "password": "12345"
}
```

**RESPONSE**
```json
{
    "user": { },
    "token": "eyIkpXV9.eyJOjE3MjA0OTI5Mjh9.CE3Lfd78"
}
```

## VALIDADOR DE JWT
> POST  
> Necessita autenticação. [ USUARIO ]

*URL = /auth/refresh_token?token=eyIkpXV9.eyJOjE3MjA0OTI5Mjh9.CE3Lfd78*

**RESPONSE**
```json
{
    "user": { },
    "newToken": "eyIkpXV9.eyJOjE3MjA0OTI5Mjh9.CE3Lfd78"
}
```

## MÓDULOS DISPONÍVEIS AO USUÁRIO
> GET  
> Necessita autenticação. [ USUARIO ]

*URL = /auth/user_authorized_modules*

**RESPONSE**
```json
[
    {
        "moduleEnum": 0,
        "moduleUrl": "/module/a",
        "usedModule": true,
        "moduleName": "Módulo A",
        "activeModule": true
    },
    {
        "moduleEnum": 1,
        "moduleUrl": "/module/b",
        "usedModule": false,
        "moduleName": "Módulo B",
        "activeModule": false
    }
]
```
# ENDPOINTS DE AUTENTICAÇÃO

## LOGIN
> POST

URL = /login  
BODY =
```
{
    "email": "{ EMAIL }",
    "password": "{ SENHA }"
}
```

**RETORNA:**
```json
"token": string
"user": User
```

## VALIDADOR DE JWT
> POST

URL = /validate_jwt?jwt={ JWT }

**RETORNA:**
```json
"ok": boolean
"user": User | null
```

## MÓDULOS DISPONÍVEIS AO USUÁRIO
> GET
- Necessita autenticação

URL = /user_authorized_modules

**RETORNA:**
```json
"authorizedModules": [
    {
        "moduleEnum": 0,
        "moduleUrl": "/URL",
        "usedModule": true
    }
]
```
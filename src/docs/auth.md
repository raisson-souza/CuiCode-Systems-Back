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

## VALIDADOR DE JWT
> POST

URL = /validate_jwt?jwt={ JWT }
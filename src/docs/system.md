# ENDPOINTS DO SISTEMA

## CRIAÇÃO DO BANCO DE DADOS
> POST  
> Necessita autenticação. (Usuário)

*URL = /system/database*

## SISTEMA EM FUNCIONAMENTO
> GET  

*URL = /system/ok*

## ESTILO DO TEMA DO FRONT END
> GET

*URL = /system/get_style*

**RESPONSE:**
```json
{
    "BackgroundPrimaryColor": "#332556",
    "BackgroundSecondaryColor": "#261b40",
    "BackgroundTerciaryColor": "#19122b",
    "FooterColor": "#402e6b",
    "HeaderColor": "#4c3781",
    "Logo": null,
    "ModulesColumnColor": "#0c0915",
    "PrimaryColor": "#805dd7",
    "SecondaryColor": "#7353c1",
    "StyleName": "Noite",
    "TerciaryColor": "#664aac",
    "TextColor": "white"
}
```

## FORMULÁRIOS FRONT END
> GET
- Necessita autenticação.

URL = /get_form/:form

FORMS DISPONÍVEIS.
- create_user
- update_user
- update_password
- confirm_restoration
- create_group
- update_group
- update_group_members
- create_solicitation
- update_solicitation
- create_dream
- update_dream
- create_post
- update_post

**Retorna** um JSON.

## CREDENCIAIS DO SISTEMA
> GET  
> Necessita autenticação. (Usuário)

*URL = /system/credentials*

**RESPONSE**
```json
{
    "Env": "testing",
    "BackBaseUrl": "http://cuicode_systems:3000",
    "FrontBaseUrl": "http://cuicode_systems:3001",
    "Port": "3000",
    "AllowedOrigins": ["http://cuicode_systems:3001"],
    "JwtSecret": "svHUVSs9h7BDBsubUD9970Sjns",
    "SystemJwt": "svHUVSs9h7BDBsubUD9970Sjns",
    "DatabaseConfig": {
        "user": "postgres",
        "host": "localhost",
        "database": "postgres",
        "password": "12345",
        "port": "5432",
    },
    "EmailSenderConfig": {
        "emailService": "gmail",
        "email": "cuicode_systems@gmail.com",
        "password": "cuicode12345",
        "receiverEmail": "admin@gmail.com"
    }
}
```

## DESATIVAÇÃO DE MÓDULO
> POST  
> Necessita autenticação. (Usuário)

*URL = /system/deactivate_module*

## SISTEMA EM MANUTENÇÃO
> POST  
> Necessita autenticação. (Usuário)

*URL = /system/maintence*
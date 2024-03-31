# ENDPOINTS DO SISTEMA

## CRIAÇÃO DO BANCO DE DADOS
> POST | GET
- Necessita autenticação.

URL = /database

## SISTEMA EM MANUTENÇÃO
> GET

URL = /ok

## ESTILO DO TEMA DO FRONT END
> GET

URL = /get_style

**RETORNA:**
```json
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
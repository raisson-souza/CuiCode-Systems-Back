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
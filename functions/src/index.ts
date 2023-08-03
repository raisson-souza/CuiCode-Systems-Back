import { onRequest } from "firebase-functions/v2/https"

// USER
import ListUsersService from "./services/user/ListUsersService"
import CreateUserService from "./services/user/CreateUserService"
import GetUserService from "./services/user/GetUserService"
import UpdateUserService from "./services/user/UpdateUserService"
import SetDeleteUserService from "./services/user/SetDeleteUserService"
import SetActiveUserService from "./services/user/SetActiveUserService"
import TraceAccessService from "./services/features/TraceAccessService"

// admin
const admin = require("firebase-admin");
admin.initializeApp()

// databases
const DATABASE = "testing"
const db_user = admin.database().ref(`/database/${ DATABASE }/users/`)

// USER SERVICES

export const GetUser = onRequest((req, res) => {
    GetUserService(req, res, db_user)
})

export const ListUsers = onRequest((req, res) => {
    ListUsersService(req, res, db_user)
})

export const CreateUser = onRequest((req, res) => {
    CreateUserService(req, res, db_user, admin, DATABASE)
})

export const UpdateUser = onRequest((req, res) => {
    UpdateUserService(req, res, db_user, admin, DATABASE)
})

export const SetActiveUser = onRequest((req, res) => {
    SetActiveUserService(req, res, db_user, admin, DATABASE)
})

export const SetDeleteUser = onRequest((req, res) => {
    SetDeleteUserService(req, res, db_user, admin, DATABASE)
})

// FEATURES

export const TraceAccess = onRequest((req, res) => {
    TraceAccessService(req, res)
})

/*
# MAJOR FIXINGS

CORS
    testar com front
AUTHORIZATION
    usar senha para uso com
        postman
        sites de api
        integrações
combinar essas seguranças para nao se anularem

# MINOR FIXINGS

# FEATURES

endpoint com método TRACE para rastreio de info do usuario conectado ao ERP
    enviar email a cada acesso com info dos usuários

# INOVAÇÃO

usar query params na requests tambem
*/

/*
PRÓXIMOS COMMITS

validação especial para convidados

mudar organização das pastas
    services
    - realiza validação de método e requisição
    operation
    - realiza a operação

    services/operations/utilities/

    explicar erros na service e só retornar após o fluxo da mesma

services dos próximos módulos: (diferenciar pelo método da requisição)
    GET
        Para listar um usuário:
            { Id: x }
        Para listar informações de vários usuários:
            { requiredInfos: ["x", "y"] }
    CREATE
        { ...User }
    UPDATE
        { UserId: x, ...User }
*/

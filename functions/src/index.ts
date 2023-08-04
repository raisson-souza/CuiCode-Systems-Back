import { onRequest } from "firebase-functions/v2/https"

// USER
import ListUsersService from "./services/user/ListUsersService"
import CreateUserService from "./services/user/CreateUserService"
import GetUserService from "./services/user/GetUserService"
import UpdateUserService from "./services/user/UpdateUserService"
import SetDeleteUserService from "./services/user/SetDeleteUserService"
import SetActiveUserService from "./services/user/SetActiveUserService"
import TraceAccessService from "./services/features/TraceAccessService"

// FUNCTIONS
import Send from "./functions/Responses"
import ValidateCorsAsync from "./functions/ValidateCorsAsync"

// admin
const admin = require("firebase-admin");
admin.initializeApp()

// databases
const DATABASE = "testing"
const db_user = admin.database().ref(`/database/${ DATABASE }/users/`)

// USER SERVICES

export const GetUser = onRequest((req, res) => {
    Promise.resolve(ValidateCorsAsync(req, res))
        .then(() => { GetUserService(req, res, db_user) })
        .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
})

export const ListUsers = onRequest((req, res) => {
    Promise.resolve(ValidateCorsAsync(req, res))
        .then(() => { ListUsersService(req, res, db_user) })
        .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
})

export const CreateUser = onRequest((req, res) => {
    Promise.resolve(ValidateCorsAsync(req, res))
        .then(() => { CreateUserService(req, res, db_user, admin, DATABASE) })
        .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
})

export const UpdateUser = onRequest((req, res) => {
    Promise.resolve(ValidateCorsAsync(req, res))
        .then(() => { UpdateUserService(req, res, db_user, admin, DATABASE) })
        .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
})

export const SetActiveUser = onRequest((req, res) => {
    Promise.resolve(ValidateCorsAsync(req, res))
        .then(() => { SetActiveUserService(req, res, db_user, admin, DATABASE) })
        .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
})

export const SetDeleteUser = onRequest((req, res) => {
    Promise.resolve(ValidateCorsAsync(req, res))
        .then(() => { SetDeleteUserService(req, res, db_user, admin, DATABASE) })
        .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
})

// FEATURES

export const TraceAccess = onRequest((req, res) => {
    TraceAccessService(req, res)
})

/*
# MAJOR FIXINGS

criar uma classe com res, req,admin,db,databas como params e alguns como possivel nulos e passar como param
para a classe e usar o param! dentro para nao ter problemas

mudar organização das pastas
    services
    - realiza validação de método e requisição
    operation
    - realiza a operação

    services/operations/utilities/

    explicar erros na service e só retornar após o fluxo da mesma

# MINOR FIXINGS

# FEATURES

# INOVAÇÃO

*/

/*
PRÓXIMOS COMMITS

endpoints a preparar
    listagem de todos os usuarios e por nivel de acesso

LOGIN
    login
    cadastro
        user normal
        convidado
            validação especial
    trace
    mudança
        senha
        email
        email rec
        username
*/

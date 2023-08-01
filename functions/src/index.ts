import { onRequest } from "firebase-functions/v2/https"

// USER
import ListUsersService from "./services/user/ListUsersService"
import CreateUserService from "./services/user/CreateUserService"
import GetUserService from "./services/user/GetUserService"
import UpdateUserService from "./services/user/UpdateUserService"
import SetDeleteUserService from "./services/user/SetDeleteUserService"
import SetActiveUserService from "./services/user/SetActiveUserService"

// admin
const admin = require("firebase-admin");
admin.initializeApp()

// databases
const db_user = admin.database().ref("/database/users/")

// USER SERVICES

export const CreateUser = onRequest((req, res) => {
    CreateUserService(req, res, db_user, admin)
})

export const ListUsers = onRequest((req, res) => {
    ListUsersService(req, res, db_user)
})

export const GetUser = onRequest((req, res) => {
    GetUserService(req, res, db_user)
})

export const UpdateUser = onRequest((req, res) => {
    UpdateUserService(req, res, db_user, admin)
})

export const SetActiveUser = onRequest((req, res) => {
    SetActiveUserService(req, res, db_user, admin)
})

export const SetDeleteUser = onRequest((req, res) => {
    SetDeleteUserService(req, res, db_user, admin)
})

/*
# MAJOR FIXINGS

validação dos métodos aceitáveis dos endpoints
username no USER (validar)
CORS

# MINOR FIXINGS

refatorar mensagens de erro
validar phone
*/

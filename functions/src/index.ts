import { onRequest } from "firebase-functions/v2/https"
import Service from "./classes/Service"

// USER
import CreateUserService from "./services/user/CRUD/CreateUserService"
import GetUserService from "./services/user/CRUD/GetUserService"
import ListUsersService from "./services/user/operational/ListUsersService"
import SetActiveUserService from "./services/user/operational/SetActiveUserService"
import SetDeleteUserService from "./services/user/CRUD/SetDeleteUserService"
import TraceAccessService from "./services/features/TraceAccessService"
import UpdateUserService from "./services/user/CRUD/UpdateUserService"

// FUNCTIONS
import Send from "./functions/Responses"
import ValidateCorsAsync from "./functions/ValidateCorsAsync"

// Database schema stage
import DatabaseStage from "./enums/DatabaseStage"
const DATABASE = DatabaseStage.testing

// USER SERVICES

export const GetUser = onRequest((req, res) => {
    const service = new Service(req, res, DATABASE)

    Promise.resolve(ValidateCorsAsync(req, res))
        .then(() => { GetUserService(service) })
        .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
})

export const ListUsers = onRequest((req, res) => {
    const service = new Service(req, res, DATABASE)
    
    Promise.resolve(ValidateCorsAsync(req, res))
        .then(() => { ListUsersService(service) })
        .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
})

export const CreateUser = onRequest((req, res) => {
    const service = new Service(req, res, DATABASE)

    Promise.resolve(ValidateCorsAsync(req, res))
        .then(() => { CreateUserService(service) })
        .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
})

export const UpdateUser = onRequest((req, res) => {
    const service = new Service(req, res, DATABASE)

    Promise.resolve(ValidateCorsAsync(req, res))
        .then(() => { UpdateUserService(service) })
        .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
})

export const SetActiveUser = onRequest((req, res) => {
    const service = new Service(req, res, DATABASE)

    Promise.resolve(ValidateCorsAsync(req, res))
        .then(() => { SetActiveUserService(service) })
        .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
})

export const SetDeleteUser = onRequest((req, res) => {
    const service = new Service(req, res, DATABASE)

    Promise.resolve(ValidateCorsAsync(req, res))
        .then(() => { SetDeleteUserService(service) })
        .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
})

// FEATURES

export const TraceAccess = onRequest((req, res) => {
    TraceAccessService(req, res)
})

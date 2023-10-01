import { onRequest } from "firebase-functions/v2/https"
import Service from "./classes/Service"

// USER
import CreateUserService from "./services/user/CRUD/CreateUserService"
import GetUserService from "./services/user/CRUD/GetUserService"
import ListUsersService from "./services/user/operational/CRUD/ListUsersService"
import TraceAccessService from "./services/features/TraceAccessService"
import UpdateUserService from "./services/user/CRUD/UpdateUserService"

// FUNCTIONS
import Send from "./functions/Responses"
import ValidateCorsAsync from "./functions/ValidateCorsAsync"

// Database schema stage
import DatabaseStage from "./enums/DatabaseStageEnum"
import ApproveUserEmailOperation from "./services/user/operational/email/ApproveUserEmailService"
import SendManualEmailApprovalService from "./services/user/operational/email/SendManualEmailApprovalService"
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

export const ApproveUserEmail = onRequest((req, res) => {
    const service = new Service(req, res, DATABASE)

    // enviar link do ERP para acessar
    // CORS não é necessário pois o acesso é externo

    ApproveUserEmailOperation(service)
})

export const SendManualEmailApproval = onRequest((req, res) => {
    const service = new Service(req, res, DATABASE)

    Promise.resolve(ValidateCorsAsync(req, res))
        .then(() => { SendManualEmailApprovalService(service) })
        .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
})

// FEATURES

export const TraceAccess = onRequest((req, res) => {
    TraceAccessService(req, res)
})

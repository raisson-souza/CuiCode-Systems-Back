import { onRequest } from "firebase-functions/v2/https"
import Service from "../classes/Service"

// USER
import CreateUserService from "../services/user/CRUD/CreateUserService"
import GetUserService from "../services/user/CRUD/GetUserService"
import ListUsersService from "../services/user/CRUD/ListUsersService"
import UpdateUserService from "../services/user/CRUD/UpdateUserService"

// EMAIL
import ApproveUserEmailOperation from "../services/user/services/email/ApproveUserEmailService"
import SendManualEmailApprovalService from "../services/user/services/email/SendManualEmailApprovalService"

// FUNCTIONS
import Send from "../functions/Responses"
import ValidateCorsAsync from "../functions/system/ValidateCorsAsync"

// Environment Config
import { ConvertNumberToDatabaseStageEnum } from "../enums/DatabaseStageEnum"
import ENVIRONMENT_STAGE from "../config/environment_config.json"
const DATABASE = ConvertNumberToDatabaseStageEnum(ENVIRONMENT_STAGE.environment)

// USER SERVICES

const GetUser = onRequest((req, res) => {
    const service = new Service(req, res, DATABASE)

    Promise.resolve(ValidateCorsAsync(req, res))
        .then(() => { GetUserService(service) })
        .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
})

const ListUsers = onRequest((req, res) => {
    const service = new Service(req, res, DATABASE)
    
    Promise.resolve(ValidateCorsAsync(req, res))
        .then(() => { ListUsersService(service) })
        .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
})

const CreateUser = onRequest((req, res) => {
    const service = new Service(req, res, DATABASE)

    Promise.resolve(ValidateCorsAsync(req, res))
        .then(() => { CreateUserService(service) })
        .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
})

const UpdateUser = onRequest((req, res) => {
    const service = new Service(req, res, DATABASE)

    Promise.resolve(ValidateCorsAsync(req, res))
        .then(() => { UpdateUserService(service) })
        .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
})

const ApproveUserEmail = onRequest((req, res) => {
    const service = new Service(req, res, DATABASE)
    // enviar link do ERP para acessar
    // CORS não é necessário pois o acesso é externo
    ApproveUserEmailOperation(service)
})

const SendManualEmailApproval = onRequest((req, res) => {
    const service = new Service(req, res, DATABASE)

    Promise.resolve(ValidateCorsAsync(req, res))
        .then(() => { SendManualEmailApprovalService(service) })
        .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
})

export {
    GetUser,
    ListUsers,
    CreateUser,
    UpdateUser,
    ApproveUserEmail,
    SendManualEmailApproval
}
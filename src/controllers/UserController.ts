import { Express } from "express"

import Service from "../classes/Service"

import Send from "../functions/Responses"
import ValidateCorsAsync from "../functions/system/ValidateCorsAsync"

// USER
import CreateUserService from "../services/user/CRUD/CreateUserService"
import GetUserService from "../services/user/CRUD/GetUserService"
import ListUsersService from "../services/user/CRUD/ListUsersService"
import UpdateUserService from "../services/user/CRUD/UpdateUserService"

// EMAIL
import ApproveUserEmailOperation from "../services/user/services/email/ApproveUserEmailService"
import SendManualEmailApprovalService from "../services/user/services/email/SendManualEmailApprovalService"

export default function UsersController(
    app : Express
)
{
    app.get('/GetUser', (req, res) => {
        const service = new Service(req, res)
    
        Promise.resolve(ValidateCorsAsync(req, res))
            .then(() => { GetUserService(service) })
            .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
    })

    app.get('/ListUsers', (req, res) => {
        const service = new Service(req, res)
        
        Promise.resolve(ValidateCorsAsync(req, res))
            .then(() => { ListUsersService(service) })
            .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
    })

    app.post('/CreateUser', (req, res) => {
        const service = new Service(req, res)
    
        Promise.resolve(ValidateCorsAsync(req, res))
            .then(() => { CreateUserService(service) })
            .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
    })

    app.put('/UpdateUser', (req, res) => {
        const service = new Service(req, res)
    
        Promise.resolve(ValidateCorsAsync(req, res))
            .then(() => { UpdateUserService(service) })
            .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
    })

    app.get('/ApproveUserEmail', (req, res) => {
        const service = new Service(req, res)
        // enviar link do ERP para acessar
        // CORS não é necessário pois o acesso é externo
        ApproveUserEmailOperation(service)
    })

    app.post('SendManualEmailApproval', (req, res) => {
        const service = new Service(req, res)
    
        Promise.resolve(ValidateCorsAsync(req, res))
            .then(() => { SendManualEmailApprovalService(service) })
            .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
    })
}
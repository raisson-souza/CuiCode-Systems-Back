import { Express } from "express"

import ValidateCorsAsync from "../functions/system/ValidateCorsAsync"

// USER
import CreateUserService from "../services/user/CRUD/CreateUserService"
import GetUserService from "../services/user/CRUD/GetUserService"
import ListUsersService from "../services/user/CRUD/ListUsersService"
import UpdateUserService from "../services/user/CRUD/UpdateUserService"

// EMAIL
import ApproveUserEmailOperation from "../services/user/services/email/ApproveUserEmailService"
import SendManualEmailApprovalService from "../services/user/services/email/SendManualEmailApprovalService"

export default function UsersController(app : Express)
{
    app.get('/GetUser', (req, res) => {
        ValidateCorsAsync(req, res)
            .then(() => {
                new GetUserService(req, res).GetUserServiceOperation()
            }).catch(() => {})
    })

    app.get('/ListUsers', (req, res) => {
        ValidateCorsAsync(req, res)
            .then(() => {
                new ListUsersService(req, res).ListUsersServiceOperation()
            }).catch(() => {})
    })

    app.post('/CreateUser', (req, res) => {
        ValidateCorsAsync(req, res)
            .then(() => {
                new CreateUserService(req, res).CreateUserServiceOperation()
            }).catch(() => {})
    })

    app.put('/UpdateUser', (req, res) => {
        ValidateCorsAsync(req, res)
            .then(() => {
                new UpdateUserService(req, res).UpdateUserServiceOperation()
            }).catch(() => {})
    })

    app.get('/ApproveUserEmail', (req, res) => {
        // enviar link do ERP para acessar
        // CORS não é necessário pois o acesso é externo
        new ApproveUserEmailOperation(req, res).ApproveUserEmailServiceOperation()
    })

    app.post('SendManualEmailApproval', (req, res) => {
        ValidateCorsAsync(req, res)
            .then(() => {
                new SendManualEmailApprovalService(req, res).SendManualEmailApprovalServiceOperation()
            }).catch(() => {})
    })
}
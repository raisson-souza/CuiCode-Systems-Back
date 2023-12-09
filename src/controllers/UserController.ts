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
import Send from "../functions/Responses"

export default function UsersController(app : Express)
{
    app.route("/user")
        .get((req, res) => {
            ValidateCorsAsync(req, res)
                .then(() => {
                    new GetUserService(req, res).GetUserServiceOperation()
                }).catch(() => {})
        })
        .post((req, res) => {
            ValidateCorsAsync(req, res)
                .then(() => {
                    new CreateUserService(req, res).CreateUserServiceOperation()
                }).catch(() => {})
        })
        .put((req, res) => {
            ValidateCorsAsync(req, res)
                .then(() => {
                    new UpdateUserService(req, res).UpdateUserServiceOperation()
                }).catch(() => {})
        })

    app.route("/users")
        .get((req, res) => {
            ValidateCorsAsync(req, res)
                .then(() => {
                    new ListUsersService(req, res).ListUsersServiceOperation()
                }).catch(() => {})
        })
        .post((_, res) => {
            Send.Invalid(res, "Operação não desenvolvida.", "Operação inválida")
        })
        .put((_, res) => {
            Send.Invalid(res, "Operação não desenvolvida.", "Operação inválida")
        })

    app.get('/email/approval', (req, res) => {
        // enviar link do ERP para acessar
        // CORS não é necessário pois o acesso é externo
        new ApproveUserEmailOperation(req, res).ApproveUserEmailServiceOperation()
    })

    app.post('/email/approval/send', (req, res) => {
        ValidateCorsAsync(req, res)
            .then(() => {
                new SendManualEmailApprovalService(req, res).SendManualEmailApprovalServiceOperation()
            }).catch(() => {})
    })
}
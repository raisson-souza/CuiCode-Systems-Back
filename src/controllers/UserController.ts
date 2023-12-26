import { Express } from "express"

import ApproveUserEmailService from "../services/user/services/email/ApproveUserEmailService"
import CreateUserService from "../services/user/CRUD/CreateUserService"
import GetUserService from "../services/user/CRUD/GetUserService"
import ListUsersService from "../services/user/CRUD/ListUsersService"
import SendManualEmailApprovalService from "../services/user/services/email/SendManualEmailApprovalService"
import UpdateUserService from "../services/user/CRUD/UpdateUserService"

import Send from "../functions/system/Send"
import AuthMiddleware from "../functions/system/AuthMiddleware"

function UsersController(app : Express)
{
    app.route("/user")
        .get(AuthMiddleware, (req, res) => {
            new GetUserService(req, res).Operation()
        })
        .post((req, res) => {
            // Não há autenticação na criação de usuário.
            new CreateUserService(req, res).Operation()
        })
        .put(AuthMiddleware, (req, res) => {
            new UpdateUserService(req, res).Operation()
        })

    app.route("/users")
        .get(AuthMiddleware, (req, res) => {
            new ListUsersService(req, res).Operation()
        })
        .post(AuthMiddleware, (_, res) => {
            Send.Invalid(res, "Operação não desenvolvida.", "Operação inválida.")
        })
        .put(AuthMiddleware, (_, res) => {
            Send.Invalid(res, "Operação não desenvolvida.", "Operação inválida.")
        })

    app.get('/email/approval', (req, res) => {
        // CORS não é necessário pois o acesso é externo
        new ApproveUserEmailService(req, res).Operation()
    })

    app.post('/email/approval/send', AuthMiddleware, (req, res) => {
        new SendManualEmailApprovalService(req, res, true).Operation()
    })
}

export default UsersController
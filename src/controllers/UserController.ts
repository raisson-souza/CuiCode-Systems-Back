import { Express } from "express"

import CreateUserService from "../services/user/CRUD/CreateUserService"
import GetUserService from "../services/user/CRUD/GetUserService"
import ListUsersService from "../services/user/CRUD/ListUsersService"
import UpdateUserService from "../services/user/CRUD/UpdateUserService"
import ApproveUserEmailOperation from "../services/user/services/email/ApproveUserEmailService"
import SendManualEmailApprovalService from "../services/user/services/email/SendManualEmailApprovalService"

import ValidateCorsAsync from "../functions/system/ValidateCorsAsync"
import Send from "../functions/Responses"

function UsersController(app : Express)
{
    app.route("/user")
        .get((req, res) => {
            ValidateCorsAsync(req, res)
                .then(() => {
                    new GetUserService(req, res).Operation()
                }).catch(() => {})
        })
        .post((req, res) => {
            ValidateCorsAsync(req, res)
                .then(() => {
                    new CreateUserService(req, res).Operation()
                }).catch(() => {})
        })
        .put((req, res) => {
            ValidateCorsAsync(req, res)
                .then(() => {
                    new UpdateUserService(req, res).Operation()
                }).catch(() => {})
        })

    app.route("/users")
        .get((req, res) => {
            ValidateCorsAsync(req, res)
                .then(() => {
                    new ListUsersService(req, res).Operation()
                }).catch(() => {})
        })
        .post((_, res) => {
            Send.Invalid(res, "Operação não desenvolvida.", "Operação inválida")
        })
        .put((_, res) => {
            Send.Invalid(res, "Operação não desenvolvida.", "Operação inválida")
        })

    app.get('/email/approval', (req, res) => {
        // CORS não é necessário pois o acesso é externo
        new ApproveUserEmailOperation(req, res).Operation()
    })

    app.post('/email/approval/send', (req, res) => {
        ValidateCorsAsync(req, res)
            .then(() => {
                new SendManualEmailApprovalService(req, res).Operation()
            }).catch(() => {})
    })
}

export default UsersController
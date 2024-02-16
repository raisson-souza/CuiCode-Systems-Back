import { Express } from "express"
import { Multer } from "multer"

import ApproveUserEmailService from "../services/user/services/email/ApproveUserEmailService"
import CreateUserService from "../services/user/CRUD/CreateUserService"
import GetUserLogsService from "../services/user/services/log/GetUserLogsService"
import GetUserPhotoService from "../services/user/services/photo/GetUserPhotoService"
import GetUserService from "../services/user/CRUD/GetUserService"
import ListUsersService from "../services/user/CRUD/ListUsersService"
import RegistryUserPhotoService from "../services/user/services/photo/RegistryUserPhotoService"
import SendManualEmailApprovalService from "../services/user/services/email/SendManualEmailApprovalService"
import UpdateUserPasswordService from "../services/user/services/account/UpdateUserPasswordService"
import UpdateUserService from "../services/user/CRUD/UpdateUserService"
import VerifyEmailService from "../services/user/services/account/VerifyEmailService"

import ResponseMessage from "../classes/system/ResponseMessage"

import AuthMiddleware from "../middlewares/AuthMiddleware"

function UsersController(app : Express, upload : Multer)
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
        .post((_, res) => {
            ResponseMessage.NotImplementedRoute(res)
        })
        .put((_, res) => {
            ResponseMessage.NotImplementedRoute(res)
        })

    app.get('/email/approval', (req, res) => {
        // CORS não é necessário pois o acesso é externo
        new ApproveUserEmailService(req, res).Operation()
    })

    app.post('/email/approval/send', AuthMiddleware, (req, res) => {
        new SendManualEmailApprovalService(req, res).Operation()
    })

    app.get('/user/logs', AuthMiddleware, (req, res) => {
        new GetUserLogsService(req, res).Operation()
    })

    app.route('/user/:user_id/photo')
        .post(AuthMiddleware, (req, res) => {
            new RegistryUserPhotoService(req, res).Operation()
        })
        .put(AuthMiddleware, (req, res) => {
            new RegistryUserPhotoService(req, res).Operation()
        })

    app.get('/user/:user_id/photo', AuthMiddleware, (req, res) => {
        new GetUserPhotoService(req, res).Operation()
    })

    app.put('/user/:user_id/password', AuthMiddleware, (req, res) => {
        new UpdateUserPasswordService(req, res).Operation()
    })

    app.get('/user/account/recovery/verify_email', (req, res) => {
        new VerifyEmailService(req, res).Operation()
    })
}

export default UsersController
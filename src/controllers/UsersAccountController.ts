import OriginAuthMiddleware from "../middlewares/OriginAuthMiddleware"
import RequestorAuthMiddleware from "../middlewares/RequestorAuthMiddleware"

import UsersAccountAppService from "../appServices/users/UsersAccountAppService"

import { ControllerProps } from "./base/types/ControllerProps"

export default function UsersAccountController(controllerProps : ControllerProps)
{
    const { app } = controllerProps

    app.get("/users/account/email/approve", async (req, res) => {
        await new UsersAccountAppService(req, res).ApproveEmail()
    })

    app.post("/users/account/email/send_approval", OriginAuthMiddleware, RequestorAuthMiddleware, async (req, res) => {
        await new UsersAccountAppService(req, res).SendEmailApproval()
    })

    app.post('/users/account/password_update', OriginAuthMiddleware, RequestorAuthMiddleware, async (req, res) => {
        await new UsersAccountAppService(req, res).UpdatePassword()
    })
}
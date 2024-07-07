import OriginAuthMiddleware from "../middlewares/OriginAuthMiddleware"
import SystemRequestorAuthMiddleware from "../middlewares/requestors/SystemRequestorAuthMiddleware"
import UserRequestorAuthMiddleware from "../middlewares/requestors/UserRequestorAuthMiddleware"

import UsersAccountAppService from "../appServices/users/UsersAccountAppService"

import { ControllerProps } from "./base/types/ControllerProps"

export default function UsersAccountController(props : ControllerProps)
{
    const { app } = props

    // TODO: deverá ser aplicado o OriginAuthMiddleware tendo em vista que a aprovação será em uma tela do front-end.
    app.get("/users/account/email/approve", async (req, res) => {
        await new UsersAccountAppService(req, res).ApproveEmail()
    })

    app.post("/users/account/email/send_approval", OriginAuthMiddleware, UserRequestorAuthMiddleware, async (req, res) => {
        await new UsersAccountAppService(req, res).SendEmailApproval()
    })

    app.post('/users/account/password_update', OriginAuthMiddleware, UserRequestorAuthMiddleware, async (req, res) => {
        await new UsersAccountAppService(req, res).UpdatePassword()
    })

    app.post('/users/account/recovery', OriginAuthMiddleware, SystemRequestorAuthMiddleware, async (req, res) => {
        await new UsersAccountAppService(req, res).AccountRecovery()
    })

    app.post('/users/account/recovery/confirm', OriginAuthMiddleware, SystemRequestorAuthMiddleware, async (req, res) => {
        await new UsersAccountAppService(req, res).ConfirmAccountRecovery()
    })

    app.post('/users/account/recovery/verify', OriginAuthMiddleware, SystemRequestorAuthMiddleware, async (req, res) => {
        await new UsersAccountAppService(req, res).VerifyAccountRecovery()
    })
}
import OriginAuthMiddleware from "../middlewares/OriginAuthMiddleware"
import SystemRequestorAuthMiddleware from "../middlewares/requestors/SystemRequestorAuthMiddleware"
import UserRequestorAuthMiddleware from "../middlewares/requestors/UserRequestorAuthMiddleware"

import UsersAppService from "../appServices/users/UsersAppService"

import { ControllerProps } from "./base/types/ControllerProps"

export default function UsersController(props : ControllerProps)
{
    const { app } = props

    app.route("/user")
        .get(OriginAuthMiddleware, UserRequestorAuthMiddleware, async (req, res) => {
            await new UsersAppService(req, res).GetUser()
        })
        .post(OriginAuthMiddleware, async (req, res) => {
            await new UsersAppService(req, res).CreateUser()
        })
        .put(OriginAuthMiddleware, UserRequestorAuthMiddleware, async (req, res) => {
            await new UsersAppService(req, res).UpdateUser()
        })

    app.route("/users")
        .get(OriginAuthMiddleware, SystemRequestorAuthMiddleware, async (req, res) => {
            await new UsersAppService(req, res).ListUsers()
        })

    app.get("/user/:id/logs", OriginAuthMiddleware, UserRequestorAuthMiddleware, async (req, res) => {
        await new UsersAppService(req, res).GetUserLogs()
    })

    app.route("/user/:id/photo")
        .get(OriginAuthMiddleware, UserRequestorAuthMiddleware, async (req, res) => {
            await new UsersAppService(req, res).GetUserPhoto()
        })
        .post(OriginAuthMiddleware, UserRequestorAuthMiddleware, async (req, res) => {
            await new UsersAppService(req, res).RegistryUserPhoto()
        })
        .put(OriginAuthMiddleware, UserRequestorAuthMiddleware, async (req, res) => {
            await new UsersAppService(req, res).RegistryUserPhoto()
        })

    app.get("/users/find_email", OriginAuthMiddleware, SystemRequestorAuthMiddleware, async (req, res) => {
        await new UsersAppService(req, res).FindEmail()
    })

    app.get("/user/daily_info", OriginAuthMiddleware, UserRequestorAuthMiddleware, async (req, res) => {
        await new UsersAppService(req, res).DailyInfo()
    })
}
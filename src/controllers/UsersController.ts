import OriginAuthMiddleware from "../middlewares/OriginAuthMiddleware"
import RequestorAuthMiddleware from "../middlewares/RequestorAuthMiddleware"

import UsersAppService from "../appServices/users/UsersAppService"

import { ControllerProps } from "./base/types/ControllerProps"

export default function UsersController(controllerProps : ControllerProps)
{
    const { app } = controllerProps

    app.route("/user")
        .get(OriginAuthMiddleware, RequestorAuthMiddleware, async (req, res) => {
            await new UsersAppService(req, res).GetUser()
        })
        .post(OriginAuthMiddleware, async (req, res) => {
            await new UsersAppService(req, res).CreateUser()
        })
        .put(OriginAuthMiddleware, RequestorAuthMiddleware, async (req, res) => {
            await new UsersAppService(req, res).UpdateUser()
        })

    app.route("/users")
        .get(OriginAuthMiddleware, RequestorAuthMiddleware, async (req, res) => {
            await new UsersAppService(req, res).ListUsers()
        })

    app.get("/user/:id/logs", OriginAuthMiddleware, RequestorAuthMiddleware, async (req, res) => {
        await new UsersAppService(req, res).GetUserLogs()
    })

    app.route("/user/:id/photo")
        .get(OriginAuthMiddleware, RequestorAuthMiddleware, async (req, res) => {
            await new UsersAppService(req, res).GetUserPhoto()
        })
        .post(OriginAuthMiddleware, RequestorAuthMiddleware, async (req, res) => {
            await new UsersAppService(req, res).RegistryUserPhoto()
        })
        .put(OriginAuthMiddleware, RequestorAuthMiddleware, async (req, res) => {
            await new UsersAppService(req, res).RegistryUserPhoto()
        })

    app.get("/users/find_email", OriginAuthMiddleware, async (req, res) => {
        await new UsersAppService(req, res).FindEmail()
    })
}
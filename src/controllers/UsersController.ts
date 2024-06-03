import OriginAuthMiddleware from "../middlewares/OriginAuthMiddleware"

import UsersAppService from "../appServices/users/UsersAppService"

import { ControllerProps } from "./base/types/ControllerProps"

export default function UsersController(controllerProps : ControllerProps)
{
    const { app } = controllerProps

    app.route("/user")
        .post(OriginAuthMiddleware, async (req, res) => {
            await new UsersAppService(req, res).CreateUser()
        })
}
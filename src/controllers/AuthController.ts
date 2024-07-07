import OriginAuthMiddleware from "../middlewares/OriginAuthMiddleware"
import UserRequestorAuthMiddleware from "../middlewares/requestors/UserRequestorAuthMiddleware"

import AuthAppService from "../appServices/auth/AuthAppService"

import { ControllerProps } from "./base/types/ControllerProps"

function AuthController(props : ControllerProps)
{
    const { app } = props

    app.post('/auth/login', OriginAuthMiddleware, async (req, res) => {
        await new AuthAppService(req, res).Login()
    })

    app.get('/auth/refresh_token', OriginAuthMiddleware, UserRequestorAuthMiddleware, async (req, res) => {
        await new AuthAppService(req, res).RefreshToken()
    })

    app.get('/auth/user_authorized_modules', OriginAuthMiddleware, UserRequestorAuthMiddleware, async (req, res) => {
        await new AuthAppService(req, res).UserAuthorizedModules()
    })
}

export default AuthController
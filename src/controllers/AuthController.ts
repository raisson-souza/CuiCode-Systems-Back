import { Express } from "express"

import OriginAuthMiddleware from "../middlewares/OriginAuthMiddleware"
import RequestorAuthMiddleware from "../middlewares/RequestorAuthMiddleware"

import LoginService from "../services/auth/LoginService"
import UserAuthorizedModulesService from "../services/auth/UserAuthorizedModules"
import ValidateJwtService from "../services/auth/ValidateJwtService"

function AuthController(app : Express)
{
    app.post('/login', OriginAuthMiddleware, async (req, res) => {
        await new LoginService(req, res).Operation()
    })

    app.get('/validate_jwt', OriginAuthMiddleware, async (req, res) => {
        await new ValidateJwtService(req, res).Operation()
    })

    app.get('/user_authorized_modules', OriginAuthMiddleware, RequestorAuthMiddleware, async (req, res) => {
        await new UserAuthorizedModulesService(req, res).Operation()
    })
}

export default AuthController
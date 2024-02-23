import { Express } from "express"

import LoginService from "../services/auth/LoginService"
import OriginAuthMiddleware from "../middlewares/OriginAuthMiddleware"

function AuthController(app : Express)
{
    app.post('/login', OriginAuthMiddleware, async (req, res) => {
        await new LoginService(req, res).Operation()
    })
}

export default AuthController
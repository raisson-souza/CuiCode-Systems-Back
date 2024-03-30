import { Express } from "express"

import LoginService from "../services/auth/LoginService"
import OriginAuthMiddleware from "../middlewares/OriginAuthMiddleware"
import ValidateJwtService from "../services/auth/ValidateJwtService"

function AuthController(app : Express)
{
    app.post('/login', OriginAuthMiddleware, async (req, res) => {
        await new LoginService(req, res).Operation()
    })

    app.get('/validate_jwt', OriginAuthMiddleware, async (req, res) => {
        await new ValidateJwtService(req, res).Operation()
    })
}

export default AuthController
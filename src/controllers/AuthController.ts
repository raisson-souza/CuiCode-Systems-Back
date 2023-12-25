import { Express } from "express"

import LoginService from "../services/auth/LoginService"

function AuthController(app : Express)
{
    app.post('/login', async (req, res) => {
        await new LoginService(req, res).Operation()
    })
}

export default AuthController
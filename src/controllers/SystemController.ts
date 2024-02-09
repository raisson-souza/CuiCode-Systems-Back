import { Express } from "express"

import DatabaseService from "../services/system/DatabaseService"
import OkService from "../services/system/OkService"

import AuthMiddleware from "../middlewares/AuthMiddleware"

function SystemController(app : Express)
{
    app.route('/database')
        .get(AuthMiddleware, async (req, res) => {
            await new DatabaseService(req, res).Operation()
        })
        .post(AuthMiddleware, async (req, res) => {
            await new DatabaseService(req, res).Operation()
        })

    app.get('/ok', (req, res) => {
        new OkService(req, res).Operation()
    })
}

export default SystemController
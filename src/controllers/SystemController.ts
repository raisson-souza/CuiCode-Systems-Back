import { Express } from "express"

import DatabaseService from "../services/system/DatabaseService"
import GetForm from "../services/system/GetForm"
import GetStyleService from "../services/system/GetStyleService"
import OkService from "../services/system/OkService"

import OriginAuthMiddleware from "../middlewares/OriginAuthMiddleware"

function SystemController(app : Express)
{
    app.route('/database')
        .get(OriginAuthMiddleware, async (req, res) => {
            await new DatabaseService(req, res).Operation()
        })
        .post(OriginAuthMiddleware, async (req, res) => {
            await new DatabaseService(req, res).Operation()
        })

    app.get('/ok', OriginAuthMiddleware, async (req, res) => {
        await new OkService(req, res).Operation()
    })

    app.get('/get_style', OriginAuthMiddleware, async (req, res) => {
        await new GetStyleService(req, res).Operation()
    })

    app.get('/get_form/:form', OriginAuthMiddleware, (req, res) => {
        new GetForm(req, res).Operation()
    })
}

export default SystemController
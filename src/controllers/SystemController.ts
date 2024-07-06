import DatabaseAppService from "../appServices/database/DatabaseAppService"
import SystemAppService from "../appServices/system/SystemAppService"

import OriginAuthMiddleware from "../middlewares/OriginAuthMiddleware"
import RequestorAuthMiddleware from "../middlewares/RequestorAuthMiddleware"

import { ControllerProps } from "./base/types/ControllerProps"

function SystemController(props : ControllerProps)
{
    const { app } = props

    app.post('/system/database', RequestorAuthMiddleware, OriginAuthMiddleware, async (req, res) => {
        await new DatabaseAppService(req, res).FoundCuiCodeSystemsDatabase()
    })

    app.get('/system/ok', OriginAuthMiddleware, async (req, res) => {
        await new SystemAppService(req, res).OkSystem()
    })

    app.get('/system/get_style', OriginAuthMiddleware, async (req, res) => {
        await new SystemAppService(req, res).SystemStyle()
    })

    app.get('/system/credentials', RequestorAuthMiddleware, OriginAuthMiddleware, async (req, res) => {
        await new SystemAppService(req, res).GetCredentials()
    })

    app.post('/system/deactivate_module', RequestorAuthMiddleware, OriginAuthMiddleware, async (req, res) => {
        await new SystemAppService(req, res).DeactivateModule()
    })

    app.post('/system/maintence', RequestorAuthMiddleware, OriginAuthMiddleware, async (req, res) => {
        await new SystemAppService(req, res).SystemUnderMaintence()
    })

    app.get('/system/get_form/:form', OriginAuthMiddleware, async (req, res) => {
        await new SystemAppService(req, res).GetForm()
    })
}

export default SystemController
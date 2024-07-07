import OriginAuthMiddleware from "../middlewares/OriginAuthMiddleware"
import SystemRequestorAuthMiddleware from "../middlewares/requestors/SystemRequestorAuthMiddleware"
import UserRequestorAuthMiddleware from "../middlewares/requestors/UserRequestorAuthMiddleware"

import DatabaseAppService from "../appServices/database/DatabaseAppService"
import SystemAppService from "../appServices/system/SystemAppService"

import { ControllerProps } from "./base/types/ControllerProps"

function SystemController(props : ControllerProps)
{
    const { app } = props

    app.post('/system/database', OriginAuthMiddleware, SystemRequestorAuthMiddleware, async (req, res) => {
        await new DatabaseAppService(req, res).FoundCuiCodeSystemsDatabase()
    })

    app.get('/system/ok', OriginAuthMiddleware, SystemRequestorAuthMiddleware, async (req, res) => {
        await new SystemAppService(req, res).OkSystem()
    })

    app.get('/system/get_style', OriginAuthMiddleware, SystemRequestorAuthMiddleware, async (req, res) => {
        await new SystemAppService(req, res).SystemStyle()
    })

    app.get('/system/credentials', OriginAuthMiddleware, UserRequestorAuthMiddleware, async (req, res) => {
        await new SystemAppService(req, res).GetCredentials()
    })

    app.post('/system/deactivate_module', OriginAuthMiddleware, UserRequestorAuthMiddleware, async (req, res) => {
        await new SystemAppService(req, res).DeactivateModule()
    })

    app.post('/system/maintence', OriginAuthMiddleware, UserRequestorAuthMiddleware, async (req, res) => {
        await new SystemAppService(req, res).SystemUnderMaintence()
    })

    app.get('/system/get_form/:form', OriginAuthMiddleware, SystemRequestorAuthMiddleware, async (req, res) => {
        await new SystemAppService(req, res).GetForm()
    })
}

export default SystemController
import TraceAccessService from "../services/features/TraceAccessService"

import OriginAuthMiddleware from "../middlewares/OriginAuthMiddleware"

import { ControllerProps } from "./base/types/ControllerProps"

function FeaturesController(props : ControllerProps)
{
    const { app } = props

    app.trace('/trace', OriginAuthMiddleware, (req, res) => {
        new TraceAccessService(req, res).Operation()
    })
}

export default FeaturesController
import { Express } from "express"

import TraceAccessService from "../services/features/TraceAccessService"

import OriginAuthMiddleware from "../middlewares/OriginAuthMiddleware"

function FeaturesController(app : Express)
{
    app.trace('/trace', OriginAuthMiddleware, (req, res) => {
        new TraceAccessService(req, res).Operation()
    })
}

export default FeaturesController
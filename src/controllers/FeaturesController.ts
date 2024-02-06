import { Express } from "express"

import TraceAccessService from "../services/features/TraceAccessService"

import AuthMiddleware from "../middlewares/AuthMiddleware"

function FeaturesController(app : Express)
{
    app.trace('/trace', AuthMiddleware, (req, res) => {
        new TraceAccessService(req, res).Operation()
    })
}

export default FeaturesController
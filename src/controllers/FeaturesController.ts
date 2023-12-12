import { Express } from "express"

import TraceAccessService from "../services/features/TraceAccessService"

import ValidateCorsAsync from "../functions/system/ValidateCorsAsync"

function FeaturesController(app : Express)
{
    app.trace('/trace', (req, res) => {
        ValidateCorsAsync(req, res)
            .then(() => {
                new TraceAccessService(req, res).Operation()
            }).catch(() => {})
    })
}

export default FeaturesController
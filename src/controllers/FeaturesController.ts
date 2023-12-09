import { Express } from "express"

import TraceAccessService from "../services/features/TraceAccessService"

import ValidateCorsAsync from "../functions/system/ValidateCorsAsync"

export default function FeaturesController(app : Express)
{
    app.trace('/trace', (req, res) => {
        ValidateCorsAsync(req, res)
            .then(() => {
                new TraceAccessService(req, res).TraceUserAccessServiceOperation()
            }).catch(() => {})
    })
}
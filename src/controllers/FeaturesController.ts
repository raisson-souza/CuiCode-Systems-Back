import { Express } from "express"

import TraceAccessService from "../services/features/TraceAccessService"

import ValidateCorsAsync from "../functions/system/ValidateCorsAsync"
import Send from "../functions/Responses"

export default function FeaturesController(
    app : Express
)
{
    app.trace('/TraceAccess', (req, res) => {
        Promise.resolve(ValidateCorsAsync(req, res))
            .then(() => {
                new TraceAccessService(req, res).TraceUserAccessServiceOperation()
            })
            .catch(() => {
                Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API")
            })
    })
}
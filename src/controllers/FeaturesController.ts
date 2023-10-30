import { Express } from "express"

import TraceAccessService from "../services/features/TraceAccessService"
import ValidateCorsAsync from "../functions/system/ValidateCorsAsync"
import Send from "../functions/Responses"

function FeaturesController(
    app : Express
)
{
    app.trace('/TraceAccess', (req, res) => {
        // const service = new Service(req, res, database)

        Promise.resolve(ValidateCorsAsync(req, res))
            .then(() => { TraceAccessService(req, res) })
            .catch(() => { Send.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API") })
    })
}

export default FeaturesController
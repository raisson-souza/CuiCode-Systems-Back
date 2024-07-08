import OriginAuthMiddleware from "../middlewares/OriginAuthMiddleware"

import { ControllerProps } from "./base/types/ControllerProps"

function FeaturesController(props : ControllerProps)
{
    const { app } = props

    // app.trace('/trace', OriginAuthMiddleware, async (req, res) => { })
}

export default FeaturesController
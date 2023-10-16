import { onRequest } from "firebase-functions/v2/https"

import TraceAccessService from "../services/features/TraceAccessService"

// FEATURES
const TraceAccess = onRequest((req, res) => {
    TraceAccessService(req, res)
})

export {
    TraceAccess
}
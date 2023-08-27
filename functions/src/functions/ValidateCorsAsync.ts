import {
    Request,
    Response,
} from "firebase-functions"

import IsUndNull from "./IsUndNull"

import CORS_CONFIG from "../config/CORS_CONFIG.json"

export default async function ValidateCorsAsync
(
    req : Request,
    res : Response,
)
: Promise<void>
{
    const {
        ALLOWED_ORIGINS,
        API_TEST_TOKEN
    } = CORS_CONFIG

    const cors = require("cors")({ origin: ALLOWED_ORIGINS })

    if (
        (
            req.header("Origin") ||
            IsUndNull(req.header("Origin"))
        ) &&
        !ALLOWED_ORIGINS.includes(req.header("Origin")!)
    )
        if (req.header("authorization") != API_TEST_TOKEN)
            throw new Error()

    cors(req, res, () => {
        res.set("Access-Control-Allow-Origin", req.get("Origin"));
    })
}

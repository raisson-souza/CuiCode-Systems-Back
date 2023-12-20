import { Request, Response } from "express"

import config from "../../config/cors_config.json"

import Send from "./Send"

import IsUndNull from "../IsUndNull"

async function ValidateCorsAsync
(
    req : Request,
    res : Response,
)
: Promise<void>
{
    const {
        allowed_origins,
        api_test_token
    } = config

    const cors = require("cors")({ origin: allowed_origins })

    if (
        (
            req.header("Origin") ||
            IsUndNull(req.header("Origin"))
        ) &&
        !allowed_origins.includes(req.header("Origin")!)
    )
        if (req.header("authorization") != api_test_token)
        {
            Send.Unauthorized(res, "Acesso a CuiCodeSystems negado.", "Acesso externo não-autorizado a API.")
            throw new Error()
        }

    cors(req, res, () => {
        res.set("Access-Control-Allow-Origin", req.get("Origin"));
    })
}

export default ValidateCorsAsync
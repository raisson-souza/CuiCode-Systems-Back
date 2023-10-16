// USER SERVICES
// import {
//     GetUser,
//     ListUsers,
//     CreateUser,
//     UpdateUser,
//     ApproveUserEmail,
//     SendManualEmailApproval
// } from "./controllers/UserController"

// FEATURES
// import {
//     TraceAccess
// } from "./controllers/FeaturesController"

// ALL CONTROLLERS
// export {
//     GetUser,
//     ListUsers,
//     CreateUser,
//     UpdateUser,
//     ApproveUserEmail,
//     SendManualEmailApproval,
//     TraceAccess
// }

import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import config from "./config/CORS_CONFIG.json"

const app = express()
app.use(bodyParser.json())

cors({ origin: config.allowed_origins })

app.get('/teste', (req, res) => {
    res.send("Hello")
})

app.get('/teste/:num', (req, res) => {
    res.send("Hello")
})

app.get('/teste/:num/outro_teste', (req, res) => {
    res.send("Hello")
})

app.get('/teste/:num/outro_teste/:x', (req, res) => {
    res.send("Hello")
})

app.post('/criar', (req, res) => {
    console.log("inicio")

    if (
        (
            req.header("Origin") ||
            (req.header("Origin") == undefined || req.header("Origin") == null)
        ) &&
        !config.allowed_origins.includes(req.header("Origin")!)
    )
        if (req.header("authorization") != config.api_test_token)
            throw new Error("cors")

    cors(() => {
        res.set("Access-Control-Allow-Origin", req.get("Origin"));
    })

    res.send("Hello")
})

app.post('/criar/:num', (req, res) => {
    if (
        (
            req.header("Origin") ||
            (req.header("Origin") == undefined || req.header("Origin") == null)
        ) &&
        !config.allowed_origins.includes(req.header("Origin")!)
    )
        if (req.header("authorization") != config.api_test_token)
            throw new Error("cors")

    console.log(req.body)
    res.send("Hello")
})

app.listen(3000, () => {
    console.log("Servidor iniciado na porta 3000");
})
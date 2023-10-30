import express from "express"
import bodyParser from "body-parser"
import cors from "cors"

import FeaturesController from "./controllers/FeaturesController"

import CORS_CONFIG from "./config/CORS_CONFIG.json"

import UsersController from "./controllers/UserController"
import SystemController from "./controllers/SystemController"

const app = express()

app.use(bodyParser.json())

cors({ origin: CORS_CONFIG.allowed_origins })

app.get('/', (_, res) => {
    res.send("CuiCodeSystems ERP by Raisson Souza")
})

FeaturesController(app)
UsersController(app)
SystemController(app)

app.listen(3000, () => {
    console.log("CuiCodeSystems ERP ouvindo na porta 3000.");
})

/*
EM PRODUÇÃO:
Alterar URL em SendApprovalUserEmailOperation.ts
*/
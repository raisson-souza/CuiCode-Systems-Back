import express from "express"
import bodyParser from "body-parser"
import cors from "cors"

import FeaturesController from "./controllers/FeaturesController"
import { ConvertNumberToDatabaseStageEnum } from "./enums/DatabaseStageEnum"

import CORS_CONFIG from "./config/CORS_CONFIG.json"
import ENVIRONMENT_STAGE from "./config/environment_config.json"
import UsersController from "./controllers/UserController"
import SystemController from "./controllers/SystemController"

const DATABASE = ConvertNumberToDatabaseStageEnum(ENVIRONMENT_STAGE.environment)

const app = express()

app.use(bodyParser.json())

cors({ origin: CORS_CONFIG.allowed_origins })

app.get('/', (req, res) => {
    res.send("CuiCodeSystems ERP by Raisson Souza")
})

FeaturesController(app, DATABASE)
UsersController(app, DATABASE)
SystemController(app, DATABASE)

app.listen(3000, () => {
    console.log("CuiCodeSystems ERP ouvindo na porta 3000.");
})
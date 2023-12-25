import bodyParser from "body-parser"
import express from "express"

import AuthController from "./controllers/AuthController"
import FeaturesController from "./controllers/FeaturesController"
import SystemController from "./controllers/SystemController"
import UsersController from "./controllers/UserController"

const app = express()

app.use(bodyParser.json())

app.get('/', (_, res) => {
    res.send("CuiCodeSystems ERP by Raisson Souza")
})

AuthController(app)
FeaturesController(app)
SystemController(app)
UsersController(app)

app.listen(3000, () => {
    console.log("CuiCodeSystems ERP ouvindo na porta 3000.");
})
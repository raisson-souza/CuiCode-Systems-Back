import bodyParser from "body-parser"
import express from "express"
import multer from 'multer' 

import AuthController from "./controllers/AuthController"
import FeaturesController from "./controllers/FeaturesController"
import SystemController from "./controllers/SystemController"
import UsersController from "./controllers/UserController"

import MegaByteCalc from "./functions/MegaByteCalc"

const app = express()
const upload = multer(
    {
        dest: './src/uploads/',
        preservePath: true,
        limits: {
            fileSize: MegaByteCalc(5),
            files: 5
        }
    })

app.use(bodyParser.json())

app.get('/', (_, res) => {
    res.send("CuiCodeSystems ERP by Raisson Souza")
})

AuthController(app)
FeaturesController(app)
SystemController(app)
UsersController(app, upload)

app.listen(3000, () => {
    console.log("CuiCodeSystems ERP ouvindo na porta 3000.");
})
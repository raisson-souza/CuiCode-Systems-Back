import express from "express"
import multer from 'multer' 

import Env from "./config/Env"

import AuthController from "./controllers/AuthController"
import AuthService from "./services/auth/AuthService"
import FeaturesController from "./controllers/FeaturesController"
import SystemController from "./controllers/SystemController"
import UsersAccountController from "./controllers/UsersAccountController"
import UsersController from "./controllers/UsersController"

import OriginAuthMiddleware from "./middlewares/OriginAuthMiddleware"

import MegaByteCalc from "./functions/math/MegaByteCalc"
import Test from "./functions/testing/Test"

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

app.use(express.json())

app.get('/', (_, res) => {
    res.send("CuiCodeSystems SGPISG desenvolvido Raisson Souza,\nSistema de Gestão de Processos Integrados, Socialização e Gamificação.")
})

// Incluída rota geral para OPTIONS para desviar problemas com CORS
// devido aos browsers realizarem uma requisição OPTIONS sempre antes.
// OBS: Validar problemas em rotas externas tipo aprovação de email (pode ser necessário criar uma controler apenas para options).
app.options("*", OriginAuthMiddleware)

const controllerProps = {
    app: app,
    upload: upload
}

AuthController(controllerProps)
FeaturesController(controllerProps)
SystemController(controllerProps)
UsersController(controllerProps)
UsersAccountController(controllerProps)

const PORT = Env.Port()

app.listen(PORT, () => {
    console.log(`CuiCodeSystems SGPISG ouvindo na porta ${ PORT }.`);
    console.log(`System JWT: ${ AuthService.CreateSystemToken() }`)
})

Test()
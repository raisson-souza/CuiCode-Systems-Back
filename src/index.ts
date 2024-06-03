import express from "express"
import multer from 'multer' 

import AuthController from "./controllers/AuthController"
import FeaturesController from "./controllers/FeaturesController"
import SystemController from "./controllers/SystemController"
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

AuthController(app)
FeaturesController(app)
SystemController(app)
UsersController({
    app: app,
    upload: upload
})

app.listen(3000, () => {
    console.log("CuiCodeSystems SGPISG ouvindo na porta 3000.");
})

Test()
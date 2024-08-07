import AreNil from "../functions/logic/AreNil"
import IsNil from "../functions/logic/IsNil"

import { EnvProps } from "../types/EnvProps"

const Env : EnvProps = {
    Env: () => {
        const _ = String(process.env["CUI_CODE_ENV"])
        if (_ != "testing" && _ != "production") return "testing"
        return _
    },
    BackBaseUrl: () => {
        const _ = String(process.env["CUI_CODE_BACK_BASE_URL"])
        if (IsNil(_)) throw new Error("Variável de ambiente CUI_CODE_BACK_BASE_URL não configurada.")
        return _
    },
    FrontBaseUrl: () => {
        const _ = String(process.env["CUI_CODE_FRONT_BASE_URL"])
        if (IsNil(_)) throw new Error("Variável de ambiente CUI_CODE_FRONT_BASE_URL não configurada.")
        return _
    },
    Port: () => {
        const _ = String(process.env["CUI_CODE_PORT"])
        if (IsNil(_)) throw new Error("Variável de ambiente CUI_CODE_PORT não configurada.")
        return _
    },
    JwtSecret: () => {
        const _ = String(process.env["CUI_CODE_JWT_SECRET"])
        if (IsNil(_)) throw new Error("Variável de ambiente CUI_CODE_JWT_SECRET não configurada.")
        return _
    },
    AllowedOrigins: () => {
        const _ = String(process.env["CUI_CODE_ALLOWED_ORIGINS"])
        if (IsNil(_)) return []
        const allowedOriginsList = _.split('@')
        if (allowedOriginsList.length === 0) return []
        const allowedOrigins : string[] = []
        allowedOriginsList.forEach(origin => {
            allowedOrigins.push(origin)
            allowedOrigins.push(`${ origin }/`)
        })
        return allowedOrigins
    },
    SystemJwtSecret: () => {
        const _ = String(process.env["CUI_CODE_SYS_JWT_SECRET"])
        if (IsNil(_)) throw new Error("Variável de ambiente CUI_CODE_SYS_JWT_SECRET não configurada.")
        return _
    },
    IsDevelopment: () => {
        const _env = Env.Env()
        return _env === "testing"
    },
    DatabaseConfig : () => {
        const user = String(process.env["CUI_CODE_POSTGRES_DATABASE_CONFIG_USER"])
        const host = String(process.env["CUI_CODE_POSTGRES_DATABASE_CONFIG_HOST"])
        const database = String(process.env["CUI_CODE_POSTGRES_DATABASE_CONFIG_DATABASE"])
        const password = String(process.env["CUI_CODE_POSTGRES_DATABASE_CONFIG_PASSWORD"])
        const port = String(process.env["CUI_CODE_POSTGRES_DATABASE_CONFIG_PORT"])

        if (AreNil({
            params: [
                user,
                host,
                database,
                password,
                password,
                port,
            ],
            allNil: false
        })) throw new Error("Uma ou mais variáveis de ambiente do banco configuradas incorretamente.")

        return {
            user,
            host,
            database,
            password,
            port,
        }
    },
    EmailSenderConfig : () => {
        const emailService = String(process.env["CUI_CODE_EMAILSENDER_EMAILSERVICE"])
        const email = String(process.env["CUI_CODE_EMAILSENDER_EMAIL"])
        const password = String(process.env["CUI_CODE_EMAILSENDER_PASSWORD"])
        const receiverEmail = String(process.env["CUI_CODE_EMAILSENDER_RECEIVER"])

        if (AreNil({
            params: [
                emailService,
                email,
                password,
                receiverEmail
            ],
            allNil: false
        })) throw new Error("Uma ou mais variáveis de ambiente do enviador de email configuradas incorretamente.")

        return {
            emailService,
            email,
            password,
            receiverEmail
        }
    },
}

export default Env
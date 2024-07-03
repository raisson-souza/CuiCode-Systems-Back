import { DatabaseConfigProps } from "./DatabaseConfigProps"
import { EmailSenderConfigProps } from "./EmailSenderConfigProps"

type AllowedOriginsProps = string[]

type EnvProps = {
    Env : () => "testing" | "production",
    BackBaseUrl : () => string,
    FrontBaseUrl : () => string,
    Port : () => string,
    JwtSecret : () => string,
    AllowedOrigins : () => AllowedOriginsProps,
    SystemJwt : () => string,
    PostManTestingException : () => boolean,
    DatabaseConfig : () => DatabaseConfigProps,
    EmailSenderConfig : () => EmailSenderConfigProps
}

export type { EnvProps }
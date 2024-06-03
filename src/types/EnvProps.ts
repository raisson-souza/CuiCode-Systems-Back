import { DatabaseConfigProps } from "./DatabaseConfigProps"

type AllowedOriginsProps = string[]

type EnvProps = {
    Env : () => "testing" | "production",
    BackBaseUrl : () => string,
    FrontBaseUrl : () => string,
    Port : () => number,
    JwtSecret : () => string,
    AllowedOrigins : () => AllowedOriginsProps,
    SystemJwt : () => string,
    PostManTestingException : () => boolean,
    DatabaseConfig : () => DatabaseConfigProps,
}

export type { EnvProps }
import SystemStyle from "../../../classes/entities/system/SystemStyle"

import ModulesEnum from "../../../enums/ModulesEnum"

import { DatabaseConfigProps } from "../../../types/DatabaseConfigProps"
import { DbProp } from "../../base/types/BaseServiceProps"
import { EmailSenderConfigProps } from "../../../types/EmailSenderConfigProps"

type SystemServiceProps = DbProp

type SystemUnderMaintenceProps = {
    maintence : boolean
} & DbProp

type DeactivateModuleProps = {
    module : ModulesEnum
    active : boolean
} & DbProp

type GetCredentialsProps = {
    isAdmRoot : boolean
}

type GetCredentialsReturn = {
    Env : string
    BackBaseUrl : string
    FrontBaseUrl : string
    Port : string
    AllowedOrigins : string[]
    JwtSecret? : string
    SystemJwt? : string
    DatabaseConfig? : DatabaseConfigProps
    EmailSenderConfig? : EmailSenderConfigProps
}

type DetermineActualSystemStyleProps = {
    systemStyles : SystemStyle[]
} & DbProp

type GetLastRegisteredUserProps = SystemServiceProps

export type {
    DeactivateModuleProps,
    DetermineActualSystemStyleProps,
    GetCredentialsProps,
    GetCredentialsReturn,
    GetLastRegisteredUserProps,
    SystemServiceProps,
    SystemUnderMaintenceProps,
}
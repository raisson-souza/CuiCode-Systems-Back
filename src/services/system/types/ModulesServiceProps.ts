import { DbProp } from "../../base/types/BaseServiceProps"

import ModulesEnum from "../../../enums/ModulesEnum"

type ModulesServiceProps = DbProp

type ActivateModuleProps = {
    moduleName : string
} & ModulesServiceProps

type DeactivateModuleProps = {
    moduleName : string
} & ModulesServiceProps

type IncludeUserInModuleProps = {
    UserId : number
} & ModulesServiceProps

type IsModuleActiveProps = {
    module? : ModulesEnum
} & ModulesServiceProps

export type {
    ActivateModuleProps,
    DeactivateModuleProps,
    IncludeUserInModuleProps,
    IsModuleActiveProps,
    ModulesServiceProps,
}
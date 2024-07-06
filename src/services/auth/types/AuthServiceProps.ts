import User from "../../../classes/entities/user/User"

import { DbProp } from "../../base/types/BaseServiceProps"

type LoginProps = {
    userEmail : string
    userPassword : string
} & DbProp

type LoginReturn = {
    user : User
    token : string
}

type UserAuthorizedModulesProps = {
    user : User
} & DbProp

type UserAuthorizedModulesReturn = {
    moduleEnum : number
    moduleUrl : string
    usedModule : boolean
    moduleName : string
    activeModule : boolean
}

type ValidateJwtProps = {
    token : string
} & DbProp

type ValidateJwtReturn = {
    user : User
    newToken : string
}

type CreateLoginTokenProps = {
    userAuthId : number
}

export type {
    CreateLoginTokenProps,
    LoginProps,
    LoginReturn,
    UserAuthorizedModulesProps,
    UserAuthorizedModulesReturn,
    ValidateJwtProps,
    ValidateJwtReturn,
}
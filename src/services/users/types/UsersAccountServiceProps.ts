import User from "../../../classes/entities/user/User"
import UserAccountRestoration from "../../../classes/entities/user/UserAccountRestoration"

import { DbProp } from "../../base/types/BaseServiceProps"

type ApproveEmailProps = {
    userId : number
    userEmail : string
} & DbProp

type SendEmailApprovalProps = {
    isCreation : boolean
    user : User
} & DbProp

type UpdatePasswordProps = {
    userId : number
    password : string
    passwordHint : string
    modifiedBy : number
    isAdmChange : boolean
} & DbProp

type AccountRecoveryProps = {
    email : string
} & DbProp

type ConfirmAccountRecoveryProps = {
    recoveryJwt : string
    userNewPassword : string
    userNewPasswordHint : string
} & DbProp

type VerifyAccountRecoveryProps = ConfirmAccountRecoveryProps

type SendAccountRecoveryEmailProps = {
    user : User
    jwt : string
}

type MassAccountRecoveryExpireProps = {
    accountRestorations : UserAccountRestoration[]
} & DbProp

export type {
    AccountRecoveryProps,
    ApproveEmailProps,
    ConfirmAccountRecoveryProps,
    MassAccountRecoveryExpireProps,
    SendAccountRecoveryEmailProps,
    SendEmailApprovalProps,
    UpdatePasswordProps,
    VerifyAccountRecoveryProps,
}
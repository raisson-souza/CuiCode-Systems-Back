import User from "../../../classes/entities/user/User"

import { DbProp } from "../../base/types/BaseServiceProps"

type AccountRecoveryProps = {

} & DbProp

type ConfirmAccountRecoveryProps = {

} & DbProp

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

export type {
    AccountRecoveryProps,
    ConfirmAccountRecoveryProps,
    ApproveEmailProps,
    SendEmailApprovalProps,
    UpdatePasswordProps
}
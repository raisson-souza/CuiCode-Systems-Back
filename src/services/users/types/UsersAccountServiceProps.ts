import User from "../../../classes/entities/user/User"

import { DbProp } from "../../base/types/BaseServiceProps"

type AccountRecoveryProps = {

} & DbProp

type ConfirmAccountRecoveryProps = {

} & DbProp

type VerifyEmailProps = {

} & DbProp

type ApproveEmailProps = {

} & DbProp

type SendEmailApprovalProps = {
    isCreation : boolean
    user : User
} & DbProp

export type {
    AccountRecoveryProps,
    ConfirmAccountRecoveryProps,
    VerifyEmailProps,
    ApproveEmailProps,
    SendEmailApprovalProps,
}
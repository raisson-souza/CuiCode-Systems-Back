import User from "../../../classes/entities/user/User"

import { DbProp } from "../../base/types/BaseServiceProps"

type AccountRecoveryProps = {

} & DbProp

type ConfirmAccountRecoveryProps = {

} & DbProp

type VerifyEmailProps = {

} & DbProp

type ApproveUserEmailProps = {

} & DbProp

type SendEmailApprovalProps = {
    isCreation : boolean,
    user : User
} & DbProp

export type {
    AccountRecoveryProps,
    ConfirmAccountRecoveryProps,
    VerifyEmailProps,
    ApproveUserEmailProps,
    SendEmailApprovalProps,
}
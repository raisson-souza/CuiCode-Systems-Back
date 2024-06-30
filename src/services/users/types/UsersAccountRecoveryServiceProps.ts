import { DbProp } from "../../base/types/BaseServiceProps"

type GetByJwtProps = {
    jwt : string
} & DbProp

type GetByUserIdProps = {
    userId : number
} & DbProp

type CreateProps = {
    email : string
} & GetByUserIdProps

type CompleteProps = {
    recoveryId : number
} & DbProp

type ExpireProps = CompleteProps

export type {
    CompleteProps,
    CreateProps,
    ExpireProps,
    GetByJwtProps,
    GetByUserIdProps,
}
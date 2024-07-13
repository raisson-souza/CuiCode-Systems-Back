import SystemError from "../../../classes/entities/system/SystemError"
import { DbProp } from "../../base/types/BaseServiceProps"

type ErrorServiceProps = DbProp

type SaveProps = {
    error : SystemError
} & ErrorServiceProps

type ListProps = ErrorServiceProps

export type {
    ErrorServiceProps,
    ListProps,
    SaveProps,
}


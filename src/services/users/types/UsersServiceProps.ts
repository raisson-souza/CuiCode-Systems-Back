import User from "../../../classes/entities/user/User"

import { DbProp } from "../../base/types/BaseServiceProps"

export type CreateProps = {
    user : User,
} & DbProp

export type UpdateProps = {
    user : User,
} & DbProp

export type InactivateProps = {
    userId : number,
} & DbProp

export type GetProps = {
    userId : number,
} & DbProp

export type GetPhotoProps = {
    userId : number,
} & DbProp

export type RegistryPhotoProps = {
    userId : number,
} & DbProp

export type ListProps = {

} & DbProp

export type AdvancedListProps = {

} & DbProp

export type DailyInfoProps = {
    userId : number,
} & DbProp

export type GetLogsProps = {
    userId : number,
} & DbProp

export type UpdatePasswordProps = {
    userId : number,
    newPassword : string,
} & DbProp

export type DeleteProps = {
    userId : number,
} & DbProp
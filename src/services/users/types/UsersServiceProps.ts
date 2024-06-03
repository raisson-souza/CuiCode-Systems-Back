import User from "../../../classes/entities/user/User"

import { DbProp } from "../../base/types/BaseServiceProps"

export type CreateUserProps = {
    user : User,
} & DbProp

export type UpdateUserProps = {
    user : User,
} & DbProp

export type InactivateUserProps = {
    userId : number,
} & DbProp

export type GetUserProps = {
    userId : number,
} & DbProp

export type GetUserPhotoProps = {
    userId : number,
} & DbProp

export type RegistryUserPhotoProps = {
    userId : number,
} & DbProp

export type ListUsersProps = {

} & DbProp

export type AdvancedUsersListProps = {

} & DbProp

export type DailyInfoProps = {
    userId : number,
} & DbProp

export type GetUserLogsProps = {
    userId : number,
} & DbProp

export type UpdatePasswordProps = {
    userId : number,
    newPassword : string,
} & DbProp
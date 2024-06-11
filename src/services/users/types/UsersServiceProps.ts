import { UpdateUserDTO } from "../../../appServices/users/base/types/UsersAppServiceProps"
import User from "../../../classes/entities/user/User"
import UserAuth from "../../../classes/entities/user/UserAuth"

import { DbProp } from "../../base/types/BaseServiceProps"

export type CreateProps = {
    user : User
} & DbProp

export type UpdateProps = {
    user : UpdateUserDTO
    updatedBy : number
    authUser : UserAuth
} & DbProp

export type InactivateProps = {
    userId : number
} & DbProp

export type GetProps = {
    userId : number
} & DbProp

export type GetPhotoProps = {
    userId : number
} & DbProp

export type RegistryPhotoProps = {
    userId : number
} & DbProp

export type ListProps = {

} & DbProp

export type AdvancedListProps = {

} & DbProp

export type DailyInfoProps = {
    userId : number
} & DbProp

export type GetLogsProps = {
    userId : number
} & DbProp

export type UpdatePasswordProps = {
    userId : number
    newPassword : string
} & DbProp

export type DeleteProps = {
    userId : number
} & DbProp

export type CreateLogProps = {
    userId : number
    oldUser : User
    newUser : User
    modifiedBy : number
    isAdmChange : boolean
} & DbProp
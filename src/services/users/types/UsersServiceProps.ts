import { UpdateUserDTO } from "../../../appServices/users/base/types/UsersAppServiceProps"
import User from "../../../classes/entities/user/User"
import UserAuth from "../../../classes/entities/user/UserAuth"

import UsersFilterEnum from "../../../enums/modules/UsersFilterEnum"
import UsersVisualizationEnum from "../../../enums/modules/UsersVisualizationEnum"

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
    visualizationEnum? : UsersVisualizationEnum
} & DbProp

export type GetPhotoProps = {
    userId : number
} & DbProp

export type RegistryPhotoProps = {
    userId : number
    photo : string
} & DbProp

export type ListProps = {
    filterEnum? : UsersFilterEnum
    visualizationEnum? : UsersVisualizationEnum
    pagination? : Pagination
} & DbProp

export type AdvancedListProps = {

} & DbProp

export type DailyInfoProps = {
    userId : number
} & DbProp

export type GetLogsProps = {
    userId : number
    initialDate? : Date
    finalDate? : Date
} & DbProp

export type GetLogsReturn = {
    id : number
    change : {
        [key : string] : string[]
    }
    date : string
    adm_change: boolean
    modified_by : number
    user_id : number
}

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

export type ListReturn = {
    data : User[]
    pagination : Pagination
}

// PRIVATE TYPES

type Pagination = {
    limit : number 
    records? : number
}
type UserOriginDTO = {
    Id : number
}

type CreateUserDTO = {
    Username : string
    Name : string
    BirthDate : string
    Email : string
    RecoveryEmail : string
    Phone : string
    Password : string
    PasswordHint : string
    PhotoBase64 : string
    Sex : number
} & UserOriginDTO

type UpdateUserDTO = {
    Active : boolean
    Deleted : boolean
    BirthDate : string
    Email : string
    Name : string
    PermissionLevel : number
    Phone : string
    PhotoBase64 : string
    RecoveryEmail : string
    Sex : number
    Username : string
} & UserOriginDTO

type InactivateUserDTO = {

} & UserOriginDTO

type GetUserDTO = {

} & UserOriginDTO

type GetUserPhotoDTO = {

} & UserOriginDTO

type RegistryUserPhotoDTO = {
    PhotoBase64 : string
} & UserOriginDTO

type ListUsersDTO = {

}

type AdvancedUsersListDTO = {

}

type DailyInfoDTO = {

} & UserOriginDTO

type GetUserLogsDTO = {

} & UserOriginDTO

type UpdatePasswordDTO = {
    Password : string
    PasswordHint : string
} & UserOriginDTO

type AccountRecoveryDTO = {

} & UserOriginDTO

type ConfirmAccountRecoveryDTO = {

} & UserOriginDTO

type VerifyEmailDTO = {

} & UserOriginDTO

type ApproveUserEmailDTO = {

}  & UserOriginDTO

export type {
    CreateUserDTO,
    UpdateUserDTO,
}
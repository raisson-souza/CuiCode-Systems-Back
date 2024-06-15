import UsersFilterEnum from "../../enums/modules/UsersFilterEnum";

export default function UsersFilterEnumParser(value : string | number) : UsersFilterEnum
{
    switch (value)
    {
        case "NoFilter":
        case 0:
            return UsersFilterEnum.NoFilter
        case "AllActive":
        case 1:
            return UsersFilterEnum.AllActive
        case "AllDeleted":
        case 2:
            return UsersFilterEnum.AllDeleted
        case "AllInactive":
        case 3:
            return UsersFilterEnum.AllInactive
        case "AllEmailApproved":
        case 4:
            return UsersFilterEnum.AllEmailApproved
        case "AllEmailUnnaproved":
        case 5:
            return UsersFilterEnum.AllEmailUnnaproved
        case "AllMonthBirthdays":
        case 6:
            return UsersFilterEnum.AllMonthBirthdays
        case "AllAdms":
        case 7:
            return UsersFilterEnum.AllAdms
        case "AllMembers":
        case 8:
            return UsersFilterEnum.AllMembers
        case "AllWithPhoto":
        case 9:
            return UsersFilterEnum.AllWithPhoto
        case "AllWithoutPhoto":
        case 10:
            return UsersFilterEnum.AllWithoutPhoto
        case "AllWomen":
        case 11:
            return UsersFilterEnum.AllWomen
        case "AllMen":
        case 12:
            return UsersFilterEnum.AllMen
        default:
            throw new Error(`Não foi possível converter ${ value } no enum UsersFilterEnum.`)
    }
}
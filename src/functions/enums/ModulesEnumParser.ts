import ModulesEnum from "../../enums/ModulesEnum"

export default function ModulesEnumParser(value : string | number) : ModulesEnum
{
    switch (value)
    {
        case "Users":
        case 0:
        case "0":
            return ModulesEnum.Users
        case "Groups":
        case 1:
        case "1":
            return ModulesEnum.Groups
        case "Board":
        case 2:
        case "2":
            return ModulesEnum.Board
        case "Morfeus":
        case 3:
        case "3":
            return ModulesEnum.Morfeus
        case "Chats":
        case 4:
        case "4":
            return ModulesEnum.Chats
        case "Solicitations":
        case 5:
        case "5":
            return ModulesEnum.Solicitations
        case "Operational":
        case 6:
        case "6":
            return ModulesEnum.Operational
        case "Cron":
        case 7:
        case "7":
            return ModulesEnum.Cron
        case "Hestia":
        case 8:
        case "8":
            return ModulesEnum.Hestia
        case "Minerva":
        case 9:
        case "9":
            return ModulesEnum.Minerva
        case "Donation":
        case 10:
        case "10":
            return ModulesEnum.Donation
        case "CuiPoints":
        case 11:
        case "11":
            return ModulesEnum.CuiPoints
        case "Anansi":
        case 12:
        case "12":
            return ModulesEnum.Anansi
        case "Zeus":
        case 13:
        case "13":
            return ModulesEnum.Zeus
        default:
            throw new Error(`Não foi possível converter ${ value } no enum ModulesEnum.`)
    }
}
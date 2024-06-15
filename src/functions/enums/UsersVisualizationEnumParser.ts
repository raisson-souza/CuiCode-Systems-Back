import UsersVisualizationEnum from "../../enums/modules/UsersVisualizationEnum"

export default function UsersVisualizationEnumParser(value : string | number) : UsersVisualizationEnum
{
    switch (value)
    {
        case "All":
        case 1:
            return UsersVisualizationEnum.All
        case "AllNoPhoto":
        case 2:
            return UsersVisualizationEnum.AllNoPhoto
        case "Resume":
        case 3:
            return UsersVisualizationEnum.Resume
        case "ResumeNoPhoto":
        case 4:
            return UsersVisualizationEnum.ResumeNoPhoto
        case "Queote":
        case 5:
            return UsersVisualizationEnum.Queote
        case "QueoteNoPhoto":
        case 6:
            return UsersVisualizationEnum.QueoteNoPhoto
        default:
            throw new Error(`Não foi possível converter ${ value } no enum UsersVisualizationEnum.`)
    }
}
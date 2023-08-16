import PermissionLevel from "../enums/PermissionLevel"

export default function PermissionLevelToNumber(permissionLevel : PermissionLevel | string)
{
    switch (permissionLevel)
    {
        case "Root":
            return 1
        case "Adm":
            return 2
        case "Member":
            return 3
        case "Guest":
            return 4
        default:
            return 4
    }
}
import PermissionLevel from "../../enums/PermissionLevelEnum"

function PermissionLevelToNumber(permissionLevel : PermissionLevel | string)
{
    switch (permissionLevel)
    {
        case "Root":
            return 4
        case "Adm":
            return 3
        case "Member":
            return 2
        case "Guest":
            return 1
        default:
            return 1
    }
}

export default PermissionLevelToNumber
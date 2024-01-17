import PermissionLevel from "../../enums/PermissionLevelEnum"

function PermissionLevelToNumber(permissionLevel : PermissionLevel)
{
    switch (permissionLevel)
    {
        case PermissionLevel.Root:
            return 4
        case PermissionLevel.Adm:
            return 3
        case PermissionLevel.Member:
            return 2
        case PermissionLevel.Guest:
            return 1
        default:
            return 1
    }
}

export default PermissionLevelToNumber
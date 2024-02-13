import PermissionLevelEnum from "../../enums/PermissionLevelEnum"

function PermissionLevelToNumber(permissionLevel : PermissionLevelEnum)
{
    // Função modificada para trocar valor padrão de CONVIDADO para MEMBRO
    switch (permissionLevel)
    {
        case PermissionLevelEnum.Root:
            return 4
        case PermissionLevelEnum.Adm:
            return 3
        case PermissionLevelEnum.Member:
            return 2
        /*
        case PermissionLevel.Guest:
            return 1
        */
        default:
            return 2
    }
}

export default PermissionLevelToNumber
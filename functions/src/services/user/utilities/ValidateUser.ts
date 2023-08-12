import User from "../../../classes/User"

import PermissionLevel from "../../../enums/PermissionLevel"
import IsUndNull from "../../../functions/IsUndNull"

/**
 * Validates a user
 */
export default async function ValidateUser
(
    user : User,
    // Validação completa em caso de criação de usuário
    isCreation : boolean = true
)
: Promise<void>
{
    try
    {
        // const usersValidationInfo : {
        //     usersUsernames : Array<string>,
        //     usersEmails : Array<string>,
        //     usersRecoveryEmails : Array<string>,
        //     usersPhones : Array<string>,
        //     rootUserPresence : boolean
        // } = {
        //     usersUsernames: [],
        //     usersEmails: [],
        //     usersRecoveryEmails: [],
        //     usersPhones: [],
        //     rootUserPresence: false
        // }
    }
    catch (ex)
    {
        throw new Error((ex as Error).message);
    }
}

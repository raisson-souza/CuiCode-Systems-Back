import User from "../../../classes/User"

import PermissionLevel from "../../../enums/PermissionLevel"

/**
 * Validates a user
 * @param db 
 * @param user 
 * @param isCreation 
 */
export default async function ValidateUser
(
    db : any,
    user : User,
    // Validação completa em caso de criação de usuário
    isCreation : boolean = true
)
: Promise<void>
{
    try
    {
        const usersValidationInfo : {
            usersUsernames : Array<string>,
            usersEmails : Array<string>,
            usersRecoveryEmails : Array<string>,
            usersPhones : Array<string>,
            rootUserPresence : boolean
        } = {
            usersUsernames: [],
            usersEmails: [],
            usersRecoveryEmails: [],
            usersPhones: [],
            rootUserPresence: false
        }

        await db.orderByValue()
            .once("value")
                .then((snapshot: Object[]) => {
                    snapshot.forEach((data: any) => {
                        usersValidationInfo.usersUsernames.push(data.val().Username)
                        usersValidationInfo.usersEmails.push(data.val().Email)
                        usersValidationInfo.usersRecoveryEmails.push(data.val().RecoveryEmail)
                        usersValidationInfo.usersPhones.push(data.val().Phone)

                        if (data.val().Level.Value == PermissionLevel.Root)
                            usersValidationInfo.rootUserPresence = true
                    })

                    if (usersValidationInfo.rootUserPresence && user.Level.Value == PermissionLevel.Root)
                        throw new Error("Já existe um usuário root.")

                    const totalUsers = usersValidationInfo.usersEmails.length
                    const userId = user.Id + 1

                    if (userId <= totalUsers && isCreation)
                        throw new Error("Id de usuário já existente.")

                    if (userId >= totalUsers && !isCreation)
                        throw new Error("Id de usuário não existente.")

                    usersValidationInfo.usersUsernames.forEach((username, i) => {
                        if (user.Id != i && username == user.Username)
                            throw new Error(`Username "${ user.Username }" já em uso.`)
                    })

                    usersValidationInfo.usersEmails.forEach((email, i) => {
                        if (user.Id != i && email == user.Email)
                            throw new Error(`Email "${ user.Email }" já em uso.`)
                    })

                    usersValidationInfo.usersRecoveryEmails.forEach((recoveryEmail, i) => {
                        if (user.Id != i && recoveryEmail == user.RecoveryEmail)
                            throw new Error(`Email de recuperação "${ user.RecoveryEmail }" já em uso.`)
                    })

                    usersValidationInfo.usersPhones.forEach((phones, i) => {
                        if (user.Id != i && phones == user.Phone)
                            throw new Error(`Número "${ user.Phone }" já em uso.`)
                    })
                })
                .catch((ex: string | undefined) => {
                    throw new Error(ex)
                })
    }
    catch (ex)
    {
        throw new Error((ex as Error).message);
    }
}

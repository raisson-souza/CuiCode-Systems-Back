import User from "../../../classes/User"

import IsUndNull from "../../../functions/IsUndNull";

import QueryUsersInfos from "./QueryUsersInfos";

/**
 * Creates or Updates a user.
 * @param admin 
 * @param user 
 * @param db 
 */
export default async function SetUser
(
    admin : any,
    user : User,
    db : any = null
)
: Promise<void>
{
    try
    {
        if (IsUndNull(user.Id))
        {
            user.Id = await Promise.resolve(
                QueryUsersInfos(db, [])
            )
            .then(totalUsers => {
                return totalUsers.length
            })
        }

        admin.database()
            .ref(`/database/users/${ user.Id }`)
            .set({
                Id: user.Id,
                Active: user.Active,
                CreatedDate: user.CreatedDate,
                Deleted: user.Deleted,
                Name : user.Name,
                BirthDate: user.BirthDate,
                Sex: user.Sex,
                Email: user.Email,
                RecoveryEmail: user.RecoveryEmail,
                Phone: user.Phone,
                Password: user.Password,
                PasswordHint: user.PasswordHint,
                Level: user.Level,
            });
    }
    catch (ex)
    {
        throw new Error(`Houve um erro ao editar o usuário ${ user.Name } #${ user.Id }. Erro: ${ (ex as Error).message }`);
    }
}

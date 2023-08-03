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
    db : any = null,
    dbRef : string,
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

        const newUser : any = {}
        const userObject : any = { ...user }

        Object.keys(user).forEach((userInfoKey) => {
            if (!IsUndNull(userObject[userInfoKey]))
                newUser[userInfoKey] = userObject[userInfoKey]
        })

        admin.database()
            .ref(`/database/${ dbRef }/users/${ user.Id }`)
            .update({ ...newUser });
    }
    catch (ex)
    {
        throw new Error((ex as Error).message);
    }
}

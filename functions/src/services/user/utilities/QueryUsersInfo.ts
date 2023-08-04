/**
 * Queries specific information about all users.
 * @param db 
 * @param requiredInfo
 * @returns 
 */
export default async function QueryUsersInfo
(
    db : any,
    requiredInfo : Array<string>
)
: Promise<Array<object>>
{
    try
    {
        const usersInfo : Array<object> = []

        return db.orderByValue()
            .once("value")
            .then((snapshot: Object[]) => {
                snapshot.forEach((data: any) => {
                    const userObject : any = {}

                    requiredInfo.forEach(info => {
                        userObject[info] = data.val()[info]
                    })

                    usersInfo.push(userObject)
                })

                return usersInfo
            })
    }
    catch (ex)
    {
        throw new Error((ex as Error).message);
    }
}

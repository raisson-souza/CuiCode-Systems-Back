/**
 * Queries specific information about all users.
 * @param db 
 * @param requiredInfos 
 * @returns 
 */
export default async function QueryUsersInfos
(
    db : any,
    requiredInfos : Array<string>
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

                    requiredInfos.forEach(info => {
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

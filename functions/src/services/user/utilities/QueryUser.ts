import User from "../../../classes/User"

import IsUndNull from "../../../functions/IsUndNull"

/**
 * Queries information about a user.
 * @param db 
 * @param userId 
 * @returns 
 */
export default async function QueryUser
(
    db : any,
    userId : number,
)
: Promise<User>
{
    let c = 0
    let userObject : any = null

    try
    {
        return db.orderByValue()
            .once("value")
            .then((snapshot: Object[]) => {
                snapshot.forEach((data: any) => {
                    if (c === userId)
                    {
                        userObject = {
                            Id: userId,
                            Active: data.val().Active,
                            CreatedDate: data.val().CreatedDate,
                            Deleted: data.val().Deleted,
                            Name : data.val().Name,
                            BirthDate: data.val().BirthDate,
                            Sex: data.val().Sex.Value,
                            Email: data.val().Email,
                            RecoveryEmail: data.val().RecoveryEmail,
                            Phone: data.val().Phone,
                            Password: data.val().Password,
                            PasswordHint: data.val().PasswordHint,
                            Level: data.val().Level.Value,
                        }
                    }
    
                    c++
                })

                if (IsUndNull(userObject))
                    throw new Error(`Usuário de ID ${ userId } não encontrado.`);

                return new User(userObject)
            })
    }
    catch (ex)
    {
        throw new Error(`Houve um problema ao buscar o usuário de ID ${ userId }. Erro: ${ (ex as Error).message }`);
    }
}

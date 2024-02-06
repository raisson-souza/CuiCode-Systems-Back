import User from "./User"

import IsUndNull from "../../../functions/logic/IsUndNull"

class UserAuth extends User
{
    Token : string | null

    constructor
    (
        user_props : any,
        headers : any = null
    )
    {
        if (user_props instanceof User)
            super({ ...user_props })
        else
            super(user_props)

        this.ExtractToken(headers)
    }

    private ExtractToken(headers : any)
    {
        try
        {
            const { authorization } = headers

            if (IsUndNull(authorization))
            {
                this.Token = null
                return
            }

            const token = authorization!.split(" ")[1]!
            this.Token = token
        }
        catch
        {
            this.Token = null
        }
    }
}

export default UserAuth
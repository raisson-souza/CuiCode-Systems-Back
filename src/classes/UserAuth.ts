import User from "./User"

import IsUndNull from "../functions/IsUndNull"

class UserAuth extends User
{
    Token : string | null

    constructor
    (
        user_props : any,
        isUserPropsSql : boolean = false,
        headers : any
    )
    {
        if (user_props instanceof User)
            super({ ...user_props }, isUserPropsSql, false, false)

        super(user_props, isUserPropsSql, false, false)

        this.ExtractToken(headers)
    }

    private ExtractToken(headers : any)
    {
        try
        {
            const { authorization } = headers

            if (IsUndNull(authorization))
                this.Token = null

            const token = authorization?.split(" ")[1]!
            this.Token = token
        }
        catch
        {
            this.Token = null
        }
    }
}

export default UserAuth
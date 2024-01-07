import User from "./User"

import EncryptPassword from "../functions/EncryptPassword"
import IsUndNull from "../functions/IsUndNull"

class UserAuth extends User
{
    Token : string | null

    constructor
    (
        user_props : any,
        isUserPropsSql : boolean = false,
        headers : any = null
    )
    {
        if (user_props instanceof User)
            super({ ...user_props }, isUserPropsSql, false, false)
        else
            super(user_props, isUserPropsSql, false, false)

        this.ExtractToken(headers)

        this.Password = EncryptPassword(this.Password)
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
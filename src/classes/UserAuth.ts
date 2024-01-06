import User from "./User"

import EncryptPassword from "../functions/EncryptPassword"
import IsUndNull from "../functions/IsUndNull"

class UserAuth extends User
{
    Token : string | null

    constructor
    (
        email : string,
        password : string,
        token : string | null = null,
        user_props : User | null = null,
        isUserPropsSql : boolean = false
    )
    {
        if (IsUndNull(user_props))
        {
            super({ Email: email, Password: password }, false, false, false)
            this.Password = EncryptPassword(password)
        }
        else
            super({ ...user_props }, isUserPropsSql, false, false)

        this.Token = token
    }

    static NewUserAuth
    (
        user_props : User,
        token : string | null = null,
        isUserPropsSql : boolean = false
    )
    {
        return new UserAuth("", "", token, user_props, isUserPropsSql)
    }
}

export default UserAuth
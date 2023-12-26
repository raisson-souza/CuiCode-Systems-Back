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
        user_props : User | null = null
    )
    {
        if (IsUndNull(user_props))
        {
            super({ Email: email, Password: password }, false, false, false)
            this.Password = EncryptPassword(password)
        }
        else
            super({ ...user_props }, false, false, false)

        this.Token = token
    }

    static NewUserAuth
    (
        user_props : User,
        token : string | null = null
    )
    {
        return new UserAuth("", "", token, user_props)
    }
}

export default UserAuth
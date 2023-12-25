import User from "./User"

import EncryptPassword from "../functions/EncryptPassword"

class UserAuth extends User
{
    Token : string | null

    constructor
    (
        email : string,
        password : string,
        token : string | null = null
    )
    {
        super({ Email: email, Password: password }, false, false, false)
        this.Password = EncryptPassword(password)
        this.Token = token
    }
}

export default UserAuth
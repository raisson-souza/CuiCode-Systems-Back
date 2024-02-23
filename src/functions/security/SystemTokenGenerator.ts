import { sign } from "jsonwebtoken"

import Env from "../../config/Env"

function SystemTokenGenerator()
{
    const {
        JWT_key
    } = Env

    const token = sign(
        { SystemKey: "cui_code_systems_admin_key" },
        JWT_key
    )

    return token
}

export default SystemTokenGenerator
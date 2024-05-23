import { sign } from "jsonwebtoken"

import env from "../../config/Env"

function SystemTokenGenerator()
{
    const token = sign(
        { SystemKey: "cui_code_systems_admin_key" },
        env.JwtSecret()
    )

    return token
}

export default SystemTokenGenerator
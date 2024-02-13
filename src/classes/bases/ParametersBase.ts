import { Client } from "pg"

import Parameters from "../entities/system/Parameters"

abstract class ParametersBase
{
    static async Get(db : Client) : Promise<Parameters>
    {
        const parameters = await db.query("SELECT * FROM parameters")
            .then(result => {
                return new Parameters(result.rows[0])
            })

        return parameters
    }
}

export default ParametersBase
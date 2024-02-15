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

    static async SetSpecialSystemStyle
    (
        db : Client,
        action : boolean
    ) : Promise<Parameters>
    {
        const query = `UPDATE parameters SET "special_system_style_on" = ${ action } WHERE "id" = 1`

        await db.query(query)

        return ParametersBase.Get(db)
    }
}

export default ParametersBase
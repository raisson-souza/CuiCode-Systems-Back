import { Client } from "pg"

import { EntityLog } from "../classes/entities/base/EntityLog"
import Possession from "../classes/entities/base/Possession"

interface IPossessionBase
{
    Get
    (
        db : Client,
        id : number
    ) : any

    UpdateByLog
    (
        db : Client,
        possessionId : number,
        model : EntityLog[],
        modifiedBy : number
    ) : any

    UpdateByModel
    (
        db : Client,
        possessionId : number,
        model : Possession,
        modifiedBy : number
    ) : any

    Create
    (
        db : Client,
        model : Possession,
        createdBy : number
    ) : any
}

export default IPossessionBase
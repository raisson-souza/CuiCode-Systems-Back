import { Client } from "pg"

import { EntityLog } from "../classes/entities/base/EntityLog"
import EntityBasic from "../classes/entities/base/EntityBasic"

interface IEntityBase
{
    Get
    (
        db : Client,
        id : number
    ) : any

    UpdateByLog
    (
        db : Client,
        entityId : number,
        model : EntityLog[],
        modifiedBy : number
    ) : any

    UpdateByModel
    (
        db : Client,
        model : EntityBasic,
        modifiedBy : number
    ) : any

    Create
    (
        db : Client,
        model : EntityBasic
    ) : any
}

export default IEntityBase
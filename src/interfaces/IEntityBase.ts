import { Client } from "pg"

import { EntityLog } from "../classes/entities/base/EntityLog"
import Entity from "../classes/entities/base/Entity"

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
        model : Entity,
        modifiedBy : number
    ) : any

    Create
    (
        db : Client,
        model : Entity
    ) : any
}

export default IEntityBase
import { Client } from "pg"

import { EntityLog } from "../classes/entities/base/EntityLog"
import EntityBasic from "../classes/entities/base/EntityBasic"

interface IBase
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
        entityId: number,
        model : EntityBasic,
        modifiedBy : number
    ) : any

    Create
    (
        db : Client,
        model : EntityBasic
    ) : any

    Delete
    (
        db : Client,
        entityId : number
    ) : any

    Deactivate
    (
        db : Client,
        entityId : number
    ) : any
}

export default IBase
import { Client } from "pg"

import IBase from "../../../interfaces/IBase"

import { EntityLog } from "../../entities/base/EntityLog"
import EntityBasic from "../../entities/base/EntityBasic"

abstract class Base implements IBase
{
    abstract Get
    (
        db : Client,
        id: number
    ) : any

    abstract UpdateByLog
    (
        db : Client,
        entityId: number,
        model: EntityLog[],
        modifiedBy: number
    ) : any

    abstract UpdateByModel
    (
        db : Client,
        entityId: number,
        model: EntityBasic,
        modifiedBy: number
    ) : any

    abstract Create
    (
        db : Client,
        model: EntityBasic
    ) : any

    abstract Delete
    (
        db : Client,
        entityId: number
    ) : any

    abstract Deactivate
    (
        db : Client,
        entityId: number
    ) : any
}

export default Base
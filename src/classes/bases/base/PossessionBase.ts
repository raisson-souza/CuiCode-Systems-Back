import { Client } from "pg"

import { EntityLog } from "../../entities/base/EntityLog"
import Possession from "../../entities/base/Possession"

import IPossessionBase from "../../../interfaces/IPossessionBase"

abstract class PossessionBase implements IPossessionBase
{
    abstract Get(db: Client, id: number) : any
    abstract UpdateByLog(db: Client, id: number, model: EntityLog[], modifierId: number) : any
    abstract UpdateByModel(db: Client, userId: number, model: Possession, modifierId: number) : any
    abstract Create(db: Client, model: Possession) : any
}

export default PossessionBase
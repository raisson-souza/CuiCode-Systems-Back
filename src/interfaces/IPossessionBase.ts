import { Client } from "pg"

import { EntityLog } from "../classes/entities/base/EntityLog"
import Possession from "../classes/entities/base/Possession"

interface IPossessionBase
{
    Get(db : Client, id : number) : any
    UpdateByLog(db : Client, id : number, model : EntityLog[], modifierId : number) : any
    UpdateByModel(db : Client, userId : number, model : Possession, modifierId : number) : any
    Create(db : Client, model : Possession) : any
}

export default IPossessionBase
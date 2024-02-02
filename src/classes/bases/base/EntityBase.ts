import { Client } from "pg"

import IEntityBase from "../../../interfaces/IEntityBase"

abstract class EntityBase implements IEntityBase
{
    abstract Get(db : Client, id : number) : any
    abstract Update(db : Client, id : number, log : any, modifierId : number) : any
    abstract UpdateByModel(db : Client, model : any, modifierId : number) : any
    abstract Create(db : Client, model : any) : any
}

export default EntityBase
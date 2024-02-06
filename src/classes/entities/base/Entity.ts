import IEntity from "../../../interfaces/IEntity"

import IsUndNull from "../../../functions/logic/IsUndNull"

abstract class Entity implements IEntity
{
    Id : number
    Active : boolean
    Created : Date
    Deleted : boolean
    Modified : Date | null
    ModifiedBy : number | null

    constructor(body : any)
    {
        this.Id = !IsUndNull(body["Id"]) ? body["Id"] : body["id"]
        this.Active = !IsUndNull(body["Active"]) ? body["Active"] : body["active"]
        this.Created = !IsUndNull(body["Created"]) ? body["Created"] : body["created"]
        this.Deleted = !IsUndNull(body["Deleted"]) ? body["Deleted"] : body["deleted"]
        this.Modified = !IsUndNull(body["Modified"]) ? body["Modified"] : body["modified"]
        this.ModifiedBy = !IsUndNull(body["ModifiedBy"]) ? body["ModifiedBy"] : body["modified_by"]
    }
}

export default Entity
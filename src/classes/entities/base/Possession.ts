import IPossession from "../../../interfaces/IPossession"

import IsUndNull from "../../../functions/IsUndNull"

abstract class Possession implements IPossession
{
    Id : number
    Active: boolean
    Created : Date
    CreatedBy : number
    Modified : Date | null
    ModifiedBy : number | null

    Construct(body : any)
    {
        this.Id = !IsUndNull(body["Id"]) ? body["Id"] : body["id"]
        this.Active = !IsUndNull(body["Active"]) ? body["Active"] : body["active"]
        this.Created = !IsUndNull(body["Created"]) ? body["Created"] : body["created"]
        this.CreatedBy = !IsUndNull(body["CreatedBy"]) ? body["CreatedBy"] : body["created_by"]
        this.Modified = !IsUndNull(body["Modified"]) ? body["Modified"] : body["modified"]
        this.ModifiedBy = !IsUndNull(body["ModifiedBy"]) ? body["ModifiedBy"] : body["modified_by"]
    }
}

export default Possession
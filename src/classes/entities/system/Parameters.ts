import IsUndNull from "../../../functions/logic/IsUndNull"

class Parameters
{
    Id : number
    SqlCommandsCreated : boolean
    SystemUnderMaintence : boolean

    constructor(body : any )
    {
        try
        {
            this.ConvertBody(body)
        }
        catch (ex)
        {
            throw new Error((ex as Error).message)
        }
    }

    private ConvertBody(body : any) : void
    {
        this.Id = !IsUndNull(body["Id"]) ? body["Id"] : body["id"]
        this.SqlCommandsCreated = !IsUndNull(body["SqlCommandsCreated"]) ? body["SqlCommandsCreated"] : body["sql_commands_created"]
        this.SystemUnderMaintence = !IsUndNull(body["SystemUnderMaintence"]) ? body["SystemUnderMaintence"] : body["system_under_maintence"]
    }
}

export default Parameters
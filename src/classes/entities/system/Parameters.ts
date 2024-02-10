import FindValue from "../../../functions/logic/FindValue"
import AnySearch from "../../../interfaces/AnySearch"
import EntityBasic from "../base/EntityBasic"

class Parameters extends EntityBasic
{
    SqlCommandsCreated : boolean
    SystemUnderMaintence : boolean
    
    constructor(body : any )
    {
        try
        {
            super(body)
            this.ConvertBody(body)
        }
        catch (ex)
        {
            throw new Error((ex as Error).message)
        }
    }
    
    ConvertBody(body : any) : void
    {
        this.SqlCommandsCreated = FindValue(body, ["SqlCommandsCreated", "sql_commands_created"])
        this.SystemUnderMaintence = FindValue(body, ["SystemUnderMaintence", "system_under_maintence"])
    }

    ConvertToSqlObject(removeUndNulls: boolean): AnySearch {
        throw new Error("Method not implemented.")
    }
}

export default Parameters
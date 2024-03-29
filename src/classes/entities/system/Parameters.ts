import EntityBasic from "../base/EntityBasic"

import FindValue from "../../../functions/logic/FindValue"

class Parameters extends EntityBasic
{
    SqlCommandsCreated : boolean
    SystemUnderMaintence : boolean
    SpecialSystemStyleOn : boolean
    
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
        this.SpecialSystemStyleOn = FindValue(body, ["SpecialSystemStyleOn", "special_system_style_on"])
    }

    ConvertToSqlObject()
    {
        return {
            "id": this.Id,
            "sql_commands_created": this.SqlCommandsCreated,
            "system_under_maintence": this.SystemUnderMaintence,
            "special_system_style_on": this.SpecialSystemStyleOn,
        }
    }
}

export default Parameters
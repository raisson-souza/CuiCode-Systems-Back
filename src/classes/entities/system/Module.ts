import EntityBasic from "../base/EntityBasic"

import FindValue from "../../../functions/logic/FindValue"
import ToBool from "../../../functions/formatting/ToBool"

import ModulesEnum from "../../../enums/ModulesEnum"

export default class Module extends EntityBasic
{
    Module : string
    Active : boolean
    ModuleEnum : ModulesEnum

    constructor(body : any )
    {
        super(body)
        this.ConvertBody(body)
        this.DefineModuleEnum()
    }

    ConvertBody(body : any)
    {
        this.Module = FindValue(body, ["Module", "module"])
        this.Active = ToBool(FindValue(body, ["Active", "active"]))
    }

    private DefineModuleEnum()
    {
        switch (this.Id)
        {
            case 2:
                this.ModuleEnum = ModulesEnum.Board; break
            case 3:
                this.ModuleEnum = ModulesEnum.Morfeus; break
            case 4:
                this.ModuleEnum = ModulesEnum.Chats; break
            case 5:
                this.ModuleEnum = ModulesEnum.Solicitations; break
            case 7:
                this.ModuleEnum = ModulesEnum.Cron; break
            case 8:
                this.ModuleEnum = ModulesEnum.Hestia; break
            case 9:
                this.ModuleEnum = ModulesEnum.Minerva; break
            case 10:
                this.ModuleEnum = ModulesEnum.Donation; break
            default:
                throw new Error("Identificador de módulo inválido.")
        }
    }

    ConvertToSqlObject()
    {
        return {
            "id": this.Id,
            "module": this.Module,
            "active": this.Active,
        }
    }
}
import EntityBasic from "../base/EntityBasic"

import FindValue from "../../../functions/logic/FindValue"
import IsUndNull from "../../../functions/logic/IsUndNull"

class SystemStyle extends EntityBasic
{
    Active : boolean
    StyleName : string

    /** Cor especial (sobrepõe outras cores conflitantes). */
    IsSpecial : boolean

    // CORES PRIMÁRIAS
    PrimaryColor : string
    SecondaryColor : string
    TerciaryColor : string

    // CORES BACKGROUND
    BackgroundPrimaryColor : string
    BackgroundSecondaryColor : string

    // CORES EXTRAS
    HeaderColor : string
    ModulesColor : string
    TextColor : string

    // CONFIG
    FinalDay : number
    FinalTime : Date
    InitialDay : number
    InitialTime : Date

    // LOGO
    /** Cor do traço da logo com fundo transparente. */
    LogoColor : "white" | "black"
    /** Formato / tipo / orientação da logo. */
    LogoType : "circle" | "left" | "right"

    constructor(body : any)
    {
        super(body)
        this.ConvertBody(body)
        this.SetTime(body)
    }

    ConvertBody(body: any) : void
    {
        this.Active = FindValue(body, ["Active", "active"])
        this.StyleName = FindValue(body, ["StyleName", "style_name"])
        this.IsSpecial = FindValue(body, ["IsSpecial", "is_special"])
        this.PrimaryColor = FindValue(body, ["PrimaryColor", "primary_color"])
        this.SecondaryColor = FindValue(body, ["SecondaryColor", "secondary_color"])
        this.TerciaryColor = FindValue(body, ["TerciaryColor", "terciary_color"])
        this.BackgroundPrimaryColor = FindValue(body, ["BackgroundPrimaryColor", "background_primary_color"])
        this.BackgroundSecondaryColor = FindValue(body, ["BackgroundSecondaryColor", "background_secondary_color"])
        this.HeaderColor = FindValue(body, ["HeaderColor", "header_color"])
        this.ModulesColor = FindValue(body, ["ModulesColor", "modules_color"])
        this.TextColor = FindValue(body, ["TextColor", "text_color"])
        this.FinalDay = FindValue(body, ["FinalDay", "final_day"])
        this.InitialDay = FindValue(body, ["InitialDay", "initial_day"])
        this.LogoColor = FindValue(body, ["LogoColor", "logo_color"])
        this.LogoType = FindValue(body, ["LogoType", "logo_type"])
    }

    SetTime(body : any)
    {
        const initialTimeString = FindValue(body, ["InitialTime", "initial_time"]) as string
        const finalTimeString = FindValue(body, ["FinalTime", "final_time"]) as string

        if (IsUndNull(initialTimeString) || IsUndNull(finalTimeString))
            return

        this.InitialTime = new Date(
            2000,
            1,
            1,
            parseInt(initialTimeString.split(":")[0]),
            parseInt(initialTimeString.split(":")[1]),
            parseInt(initialTimeString.split(":")[2])
        )
        this.FinalTime = new Date(
            2000,
            1,
            1,
            parseInt(finalTimeString.split(":")[0]),
            parseInt(finalTimeString.split(":")[1]),
            parseInt(finalTimeString.split(":")[2])
        )
    }

    ConvertToSqlObject()
    {
        return {
            "active": this.Active,
            "style_name": this.StyleName,
            "is_special": this.IsSpecial,
            "primary_color": this.PrimaryColor,
            "secondary_color": this.SecondaryColor,
            "terciary_color": this.TerciaryColor,
            "background_primary_color": this.BackgroundPrimaryColor,
            "background_secondary_color": this.BackgroundSecondaryColor,
            "modules_color": this.ModulesColor,
            "header_color": this.HeaderColor,
            "text_color": this.TextColor,
            "final_day": this.FinalDay,
            "final_time": this.FinalTime,
            "initial_day": this.InitialDay,
            "initial_time": this.InitialTime,
            "logoColor": this.LogoColor,
            "logoType": this.LogoType,
        }
    }

    FrontEndConvertedStyle()
    {
        return {
            "StyleName": this.StyleName,
            "PrimaryColor": this.PrimaryColor,
            "SecondaryColor": this.SecondaryColor,
            "TerciaryColor": this.TerciaryColor,
            "BackgroundPrimaryColor": this.BackgroundPrimaryColor,
            "BackgroundSecondaryColor": this.BackgroundSecondaryColor,
            "HeaderColor": this.HeaderColor,
            "ModulesColumnColor": this.ModulesColor,
            "TextColor": this.TextColor,
            "LogoColor": this.LogoColor,
            "LogoType": this.LogoType,
        }
    }
}

export default SystemStyle
import EntityBasic from "../base/EntityBasic"

import FindValue from "../../../functions/logic/FindValue"
import IsUndNull from "../../../functions/logic/IsUndNull"

class SystemStyle extends EntityBasic
{
    Active : boolean
    BackgroundPrimaryColor : string
    BackgroundSecondaryColor : string
    BackgroundTerciaryColor : string
    FinalDay : number
    FinalTime : Date
    FooterColor : string
    HeaderColor : string
    InitialDay : number
    InitialTime : Date
    IsSpecial : boolean
    Logo : string
    ModulesColumnColor : string
    PrimaryColor : string
    SecondaryColor : string
    StyleName : string
    TerciaryColor : string
    TextColor : string

    constructor(body : any)
    {
        super(body)
        this.ConvertBody(body)
        this.SetTime(body)
    }

    ConvertBody(body: any) : void
    {
        this.Active = FindValue(body, ["Active", "active"])
        this.BackgroundPrimaryColor = FindValue(body, ["BackgroundPrimaryColor", "background_primary_color"])
        this.BackgroundSecondaryColor = FindValue(body, ["BackgroundSecondaryColor", "background_secondary_color"])
        this.BackgroundTerciaryColor = FindValue(body, ["BackgroundTerciaryColor", "background_terciary_color"])
        this.FinalDay = FindValue(body, ["FinalDay", "final_day"])
        this.FooterColor = FindValue(body, ["FooterColor", "footer_color"])
        this.HeaderColor = FindValue(body, ["HeaderColor", "header_color"])
        this.InitialDay = FindValue(body, ["InitialDay", "initial_day"])
        this.IsSpecial = FindValue(body, ["IsSpecial", "is_special"])
        this.Logo = FindValue(body, ["Logo", "logo"])
        this.ModulesColumnColor = FindValue(body, ["ModulesColumnColor", "modules_column_color"])
        this.PrimaryColor = FindValue(body, ["PrimaryColor", "primary_color"])
        this.SecondaryColor = FindValue(body, ["SecondaryColor", "secondary_color"])
        this.StyleName = FindValue(body, ["StyleName", "style_name"])
        this.TerciaryColor = FindValue(body, ["TerciaryColor", "terciary_color"])
        this.TextColor = FindValue(body, ["TextColor", "text_color"])
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
            "background_primary_color": this.BackgroundPrimaryColor,
            "background_secondary_color": this.BackgroundSecondaryColor,
            "background_terciary_color": this.BackgroundTerciaryColor,
            "final_day": this.FinalDay,
            "final_time": this.FinalTime,
            "footer_color": this.FooterColor,
            "header_color": this.HeaderColor,
            "initial_day": this.InitialDay,
            "initial_time": this.InitialTime,
            "is_special": this.IsSpecial,
            "logo": this.Logo,
            "modules_column_color": this.ModulesColumnColor,
            "primary_color": this.PrimaryColor,
            "secondary_color": this.SecondaryColor,
            "style_name": this.StyleName,
            "terciary_color": this.TerciaryColor,
            "text_color": this.TextColor,
        }
    }

    FrontEndConvertedStyle()
    {
        return {
            "BackgroundPrimaryColor": this.BackgroundPrimaryColor,
            "BackgroundSecondaryColor": this.BackgroundSecondaryColor,
            "BackgroundTerciaryColor": this.BackgroundTerciaryColor,
            "FooterColor": this.FooterColor,
            "HeaderColor": this.HeaderColor,
            "Logo": this.Logo,
            "ModulesColumnColor": this.ModulesColumnColor,
            "PrimaryColor": this.PrimaryColor,
            "SecondaryColor": this.SecondaryColor,
            "StyleName": this.StyleName,
            "TerciaryColor": this.TerciaryColor,
            "TextColor": this.TextColor,
        }
    }
}

export default SystemStyle
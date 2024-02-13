import EntityBasic from "../base/EntityBasic"

import FindValue from "../../../functions/logic/FindValue"
import IsUndNull from "../../../functions/logic/IsUndNull"

class SystemStyle extends EntityBasic
{
    Active : boolean
    BackgroundStyle : number
    FinalDay : number
    FinalTime : Date
    FooterColor : string
    HeaderColor : string
    InitialDay : number
    InitialTime : Date
    IsSpecial : boolean
    Logo : string
    PopUpStyle : number
    StyleName : string

    constructor(body : any)
    {
        super(body)
        this.ConvertBody(body)
        this.SetTime(body)
    }

    ConvertBody(body: any) : void
    {
        this.Active = FindValue(body, ["Active", "active"])
        this.BackgroundStyle = FindValue(body, ["BackgroundStyle", "background_style"])
        this.FinalDay = FindValue(body, ["FinalDay", "final_day"])
        this.FooterColor = FindValue(body, ["FooterColor", "footer_color"])
        this.HeaderColor = FindValue(body, ["HeaderColor", "header_color"])
        this.InitialDay = FindValue(body, ["InitialDay", "initial_day"])
        this.IsSpecial = FindValue(body, ["IsSpecial", "is_special"])
        this.Logo = FindValue(body, ["Logo", "logo"])
        this.PopUpStyle = FindValue(body, ["PopUpStyle", "popup_style"])
        this.StyleName = FindValue(body, ["StyleName", "style_name"])
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
            "logo": this.Logo,
            "header_color": this.HeaderColor,
            "footer_color": this.FooterColor,
            "background_style": this.BackgroundStyle,
            "popup_style": this.PopUpStyle,
            "initial_day": this.InitialDay,
            "initial_time": this.InitialTime,
            "final_day": this.FinalDay,
            "final_time": this.FinalTime,
            "is_special": this.IsSpecial,
        }
    }

    FrontEndConvertedStyle()
    {
        return {
            "style_name": this.StyleName,
            "logo": this.Logo,
            "header_color": this.HeaderColor,
            "footer_color": this.FooterColor,
            "background_style": this.BackgroundStyle,
            "popup_style": this.PopUpStyle,
        }
    }
}

export default SystemStyle
import Exception from "../../classes/custom/Exception"
import ParametersBase from "../../classes/bases/ParametersBase"
import ResponseMessage from "../../classes/system/ResponseMessage"
import ServerService from "../../classes/service/ServerService"
import SystemStyle from "../../classes/entities/system/SystemStyle"

import IsUndNull from "../../functions/logic/IsUndNull"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"

/**
 * Captura e determina o estilo do sistema.
 */
class GetStyleService extends ServerService
{
    Action = "Estilo do Sistema."
    DefaultSystemStyle = new SystemStyle(
        {
            "style_name": "Estilo Padrão",
            "logo": "Logo Padrão", // DEFINIR LOGO PADRÃO
            "header_color": "", // DEFINIR COR DO HEADER
            "footer_color": "", // DEFINIR COR DO FOOTER
            "background_style": 1,
            "popup_style": 1,
        }
    )

    CheckBody() { }

    CheckQuery() { }

    CheckParams() { }

    async Operation()
    {
        try
        {
            const { Action } = this

            const systemStyles : SystemStyle[] = []

            await this.DB_connection.query("SELECT * FROM system_styles")
                .then(result => {
                    result.rows.forEach(row => {
                        systemStyles.push(new SystemStyle(row))
                    })
                })

            let systemStyle = await this.DetermineSystemStyle(systemStyles)

            if (IsUndNull(systemStyle))
                systemStyle = this.DefaultSystemStyle

            ResponseMessage.Send(
                HttpStatusEnum.OK,
                systemStyle!.FrontEndConvertedStyle(),
                Action,
                this.RES
            )
        }
        catch (ex)
        {
            ResponseMessage.Send(
                HttpStatusEnum.INTERNAL_SERVER_ERROR,
                `Houve um erro ao determinar a estilo do sistema. Erro: ${ (ex as Error).message }`,
                this.Action,
                this.RES
            )
            Exception.UnexpectedError((ex as Error).message, this.Action)
        }
        finally
        {
            this.DB_connection.end()
        }
    }

    private async DetermineSystemStyle(systemStyles : SystemStyle[]) : Promise<SystemStyle>
    {
        if (systemStyles.length === 0)
            return this.DefaultSystemStyle

        const parameters = await ParametersBase.Get(this.DB_connection)

        let filteredSystemStyles : SystemStyle[] = []

        const {
            day,
            hour,
            minute,
            second,
        } = this.GetNowTime()

        if (parameters.SpecialSystemStyleOn)
        {
            filteredSystemStyles = systemStyles.filter(systemStyle => {
                return (
                    systemStyle.IsSpecial &&
                    systemStyle.Active &&
                    (
                        day >= systemStyle.InitialDay &&
                        day <= systemStyle.FinalDay
                    )
                )
            })
        }
        else
        {
            filteredSystemStyles = systemStyles.filter(systemStyle => {
                return (
                    !systemStyle.IsSpecial &&
                    systemStyle.Active &&
                    (
                        day >= systemStyle.InitialDay &&
                        day <= systemStyle.FinalDay
                    )
                )
            })
        }

        filteredSystemStyles = filteredSystemStyles.filter(systemStyle => {
            const {
                initialHour,
                initialMinute,
                initialSecond,
                finalHour,
                finalMinute,
                finalSecond,
            } = this.GetSystemStyleTime(systemStyle)

            let crossDayTime = false

            if (initialHour > finalHour)
                crossDayTime = true

            if (crossDayTime)
            {
                if (
                    (
                        (hour >= initialHour && hour >= finalHour) ||
                        (hour <= initialHour && hour <= finalHour)
                    ) &&
                    (
                        (minute >= initialMinute && minute <= finalMinute) &&
                        (second >= initialSecond && second <= finalSecond)
                    )
                )
                    return true
            }
            else
            {
                if (
                    (hour >= initialHour && hour <= finalHour) &&
                    (minute >= initialMinute && minute <= finalMinute) &&
                    (second >= initialSecond && second <= finalSecond)
                )
                    return true
            }

            return false
        })

        if (filteredSystemStyles.length === 0)
            return this.DefaultSystemStyle

        return filteredSystemStyles[0]
    }

    private GetSystemStyleTime(systemStyle : SystemStyle)
    {
        return {
            "initialHour" : systemStyle.InitialTime.getHours(),
            "initialMinute" : systemStyle.InitialTime.getMinutes(),
            "initialSecond" : systemStyle.InitialTime.getSeconds(),
            "finalHour" : systemStyle.FinalTime.getHours(),
            "finalMinute" : systemStyle.FinalTime.getMinutes(),
            "finalSecond" : systemStyle.FinalTime.getSeconds(),
        }
    }

    private GetNowTime()
    {
        const date = new Date()
        return {
            "day" : date.getDay() + 1,
            "hour" : date.getHours(),
            "minute" : date.getMinutes(),
            "second" : date.getSeconds(),
        }
    }
}

export default GetStyleService
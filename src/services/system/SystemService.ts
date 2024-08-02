import Env from "../../config/Env"

import ModulesService from "./ModulesService"
import Parameters from "../../classes/entities/system/Parameters"
import SystemStyle from "../../classes/entities/system/SystemStyle"
import User from "../../classes/entities/user/User"
import UsersService from "../users/UsersService"

import {
    DeactivateModuleProps,
    DetermineActualSystemStyleProps,
    GetCredentialsProps,
    GetCredentialsReturn,
    GetLastRegisteredUserProps,
    SystemServiceProps,
    SystemUnderMaintenceProps
} from "./types/SystemServiceProps"

import ModulesEnum from "../../enums/ModulesEnum"
import UsersVisualizationEnum from "../../enums/modules/UsersVisualizationEnum"

export default abstract class SystemService
{
    /** Estilo padrão do sistema (Padrão Backend). */
    static DefaultSystemStyle = new SystemStyle(
        {
            "style_name": 'day default backend',
            "primary_color": "#91CCFF",
            "secondary_color": "#55B0FE",
            "terciary_color": "#0089FF",
            "background_primary_color": "#7A7A7A",
            "background_secondary_color": "#B5B5B5",
            "header_color": "#FFFFFF",
            "modules_color": "#D5D5D5",
            "text_color": "#000000",
            "logo_color": "black",
            "logo_type": "left",
        }
    )

    /** Captura os parâmetros do sistema. */
    static async GetParameters(props : SystemServiceProps) : Promise<Parameters>
    {
        return await props.Db.PostgresDb.query("SELECT * FROM parameters")
            .then(result => {
                return new Parameters(result.rows[0])
            })
            .catch(ex => { throw new Error(ex.message) })
    }

    /** Captura os estilos do sistema. */
    static async GetSystemsStyles(props : SystemServiceProps) : Promise<SystemStyle[]>
    {
        try
        {
            let systemsStyles = await props.Db.PostgresDb.query("SELECT * FROM system_styles")
                .then(result => {
                    const systemsStyles : SystemStyle[] = []
    
                    result.rows.map(row => {
                        systemsStyles.push(new SystemStyle(row))
                    })
    
                    return systemsStyles
                })

            return systemsStyles.length > 0
                ? systemsStyles
                : [this.DefaultSystemStyle]
        }
        catch
        {
            return [this.DefaultSystemStyle]
        }
    }

    /** Filtra uma lista de estilos de sistema para o estilo adequado atual conforme parametrização. */
    static async DetermineActualSystemStyle(props : DetermineActualSystemStyleProps)
    {
        const { systemStyles } = props

        const getSystemStyleParsedTime = (systemStyle : SystemStyle) => {
            return {
                "initialHour": systemStyle.InitialTime.getHours(),
                "initialMinute": systemStyle.InitialTime.getMinutes(),
                "initialSecond": systemStyle.InitialTime.getSeconds(),
                "finalHour": systemStyle.FinalTime.getHours(),
                "finalMinute": systemStyle.FinalTime.getMinutes(),
                "finalSecond": systemStyle.FinalTime.getSeconds(),
            }
        }

        if (systemStyles.length === 0)
            return this.DefaultSystemStyle

        const parameters = await SystemService.GetParameters({
            Db: props.Db
        })

        let filteredSystemStyles : SystemStyle[] = []

        const day = new Date().getDay() + 1
        const hour = new Date().getHours()
        const minute = new Date().getMinutes()
        const second = new Date().getSeconds()

        if (parameters.SpecialSystemStyleOn)
        {
            filteredSystemStyles = systemStyles.filter(systemStyle => {
                return (
                    systemStyle.IsSpecial &&
                    systemStyle.Active &&
                    (systemStyle.InitialDay >= day && systemStyle.FinalDay <= day)
                )
            })
        }
        else
        {
            filteredSystemStyles = systemStyles.filter(systemStyle => {
                return (
                    !systemStyle.IsSpecial &&
                    systemStyle.Active &&
                    (systemStyle.InitialDay >= day && systemStyle.FinalDay <= day)
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
            } = getSystemStyleParsedTime(systemStyle)

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

    /** Define se o sistema está em manutenção ou não. */
    static async SystemUnderMaintence(props : SystemUnderMaintenceProps)
    {
        const { maintence } = props

        await props.Db.PostgresDb.query(`UPDATE parameters SET system_under_maintence = ${ maintence }`)
            .then(() => { })
            .catch(ex => { throw new Error(ex.message) })
    }

    /** Desativa todos os processo de um módulo. */
    static async DeactivateModule(props : DeactivateModuleProps)
    {
        const { active, module } = props

        const parseModuleName = () => {
            switch (module)
            {
                case ModulesEnum.Board: return "board"
                case ModulesEnum.Morfeus: return "morfeus"
                case ModulesEnum.Chats: return "chats"
                case ModulesEnum.Solicitations: return "solicitations"
                case ModulesEnum.Cron: return "cron"
                case ModulesEnum.Hestia: return "hestia"
                case ModulesEnum.Minerva: return "minerva"
                case ModulesEnum.Donation: return "donation"
                default: throw new Error("Módulo desconhecido")
            }
        }

        switch (module) {
            // Estes módulos não podem ser desativados.
            case ModulesEnum.Users:
            case ModulesEnum.Groups:
            case ModulesEnum.Operational:
            case ModulesEnum.CuiPoints:
                throw new Error("Este módulo não pode ser desativado.")
            case ModulesEnum.Anansi:
            case ModulesEnum.Zeus:
            case ModulesEnum.Cron:
            case ModulesEnum.Hestia:
            case ModulesEnum.Minerva:
            case ModulesEnum.Donation:
            case ModulesEnum.Chats:
                throw new Error("Módulo ainda não desenvolvido.")
            case ModulesEnum.Board:
            case ModulesEnum.Morfeus:
            case ModulesEnum.Solicitations:
                if (active)
                {
                    await ModulesService.ActivateModule({
                        Db: props.Db,
                        moduleName: parseModuleName()
                    })
                    return
                }
                await ModulesService.DeactivateModule({
                    Db: props.Db,
                    moduleName: parseModuleName()
                })
            default:
                return
        }
    }

    /** Captura as credenciais do sistema. */
    static GetCredentials(props : GetCredentialsProps) : GetCredentialsReturn
    {
        const { isAdmRoot } = props

        const credentials : GetCredentialsReturn = {
            Env: Env.Env(),
            BackBaseUrl: Env.BackBaseUrl(),
            FrontBaseUrl: Env.FrontBaseUrl(),
            Port: Env.Port(),
            AllowedOrigins: Env.AllowedOrigins(),
        }

        if (isAdmRoot)
        {
            credentials.JwtSecret = Env.JwtSecret()
            credentials.SystemJwt = Env.SystemJwtSecret()
            credentials.DatabaseConfig = Env.DatabaseConfig()
            credentials.EmailSenderConfig = Env.EmailSenderConfig()
        }

        return credentials
    }

    /** Captura o último usuário cadastrado no sistema. */
    static async GetLastRegisteredUser(props : GetLastRegisteredUserProps) : Promise<User>
    {
        const query = "SELECT id FROM users ORDER BY id DESC LIMIT 1"

        const userId = await props.Db.PostgresDb.query(query)
            .then(result => {
                return result.rows[0]["id"]
            })
            .catch(ex => { throw new Error(ex) })

        return await UsersService.Get({
            Db: props.Db,
            userId: userId,
            visualizationEnum: UsersVisualizationEnum.Resume
        })
    }
}
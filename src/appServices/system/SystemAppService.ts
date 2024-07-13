import AppServiceBase from "../base/AppServiceBase"
import FormService from "../../services/system/FormService"
import ResponseMessage from "../../classes/system/ResponseMessage"
import SystemService from "../../services/system/SystemService"

import ISystemAppService from "./ISystemAppService"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"
import PermissionLevelEnum from "../../enums/PermissionLevelEnum"

import IsNil from "../../functions/logic/IsNil"
import ModulesEnumParser from "../../functions/enums/ModulesEnumParser"
import ToBool from "../../functions/formatting/ToBool"

export default class SystemAppService extends AppServiceBase implements ISystemAppService
{
    AppServiceAction = "Sistema"

    async OkSystem()
    {
        const ACTION = `${ this.AppServiceAction } / Estabilidade do Sistema`
        try
        {
            await this.AuthenticateSystemRequestor()
            await this.Db.ConnectPostgres()

            const parameters = await SystemService.GetParameters({
                Db: this.Db
            })

            if (parameters.SystemUnderMaintence)
            {
                await ResponseMessage.Send({
                    expressResponse: this.RES,
                    responseData: false,
                    responseLog: ACTION,
                    responseStatus: HttpStatusEnum.UNAVAIALBLE
                })
            }
        
            await ResponseMessage.Success({
                responseData: true,
                responseLog: ACTION,
                expressResponse: this.RES
            })
    
            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            await ResponseMessage.InternalServerError({
                responseData: (ex as Error).message,
                responseLog: ACTION,
                expressResponse: this.RES
            })
        }
    }

    async SystemStyle()
    {
        const ACTION = `${ this.AppServiceAction } / Estilo atual do Sistema`
        try
        {
            await this.Db.ConnectPostgres()
            await this.AuthenticateSystemRequestor()

            const systemStyles = await SystemService.GetSystemsStyles({
                Db: this.Db
            })

            const actualSystemStyle = await SystemService.DetermineActualSystemStyle({
                Db: this.Db,
                systemStyles: systemStyles
            })

            await ResponseMessage.Success({
                responseData: actualSystemStyle.FrontEndConvertedStyle(),
                responseLog: ACTION,
                expressResponse: this.RES
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            await ResponseMessage.InternalServerError({
                responseData: SystemService.DefaultSystemStyle,
                responseLog: ACTION,
                expressResponse: this.RES
            })
        }
    }

    async DeactivateModule()
    {
        const ACTION = `${ this.AppServiceAction } / Desativação de Módulo`
        try
        {
            await this.Db.ConnectPostgres()
            await this.AuthenticateUserRequestor()
            await this.ValidateUserRequestor({
                level: PermissionLevelEnum.Adm
            })

            const activateModule = this.REQ.query["active"] as string
            const moduleNumber = this.REQ.query["module"] as string

            if (IsNil(activateModule) || IsNil(moduleNumber))
            {
                await ResponseMessage.SendInvalidField({
                    expressResponse: this.RES,
                    fields: ["active", "module"],
                    responseLog: ACTION,
                })
            }

            await SystemService.DeactivateModule({
                Db: this.Db,
                active: ToBool(activateModule),
                module: ModulesEnumParser(moduleNumber)
            })

            const message = `Módulo ${ ToBool(activateModule) ? "ativado" : "desativado" } com sucesso.`

            await ResponseMessage.Success({
                responseData: message,
                responseLog: ACTION,
                expressResponse: this.RES
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            await ResponseMessage.InternalServerError({
                responseData: (ex as Error).message,
                responseLog: ACTION,
                expressResponse: this.RES
            })
        }
    }

    async SystemUnderMaintence()
    {
        const ACTION = `${ this.AppServiceAction } / Sistema em Manutenção`
        try
        {
            const systemUnderMaintence = ToBool(this.GetReqBodyValue("maintence"))

            if (IsNil(systemUnderMaintence))
            {
                ResponseMessage.SendNullField({
                    expressResponse: this.RES,
                    fields: ["maintence"],
                    responseLog: ACTION
                })
            }

            await this.Db.ConnectPostgres()
            await this.AuthenticateUserRequestor()
            await this.ValidateUserRequestor({
                level: PermissionLevelEnum.Adm
            })

            await SystemService.SystemUnderMaintence({
                Db: this.Db,
                maintence: systemUnderMaintence
            })

            await ResponseMessage.Success({
                responseData: null,
                responseLog: ACTION,
                expressResponse: this.RES
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            await ResponseMessage.InternalServerError({
                responseData: (ex as Error).message,
                responseLog: ACTION,
                expressResponse: this.RES
            })
        }
    }

    async GetCredentials()
    {
        const ACTION = `${ this.AppServiceAction } / Captura as Credenciais do Sistema`
        try
        {
            await this.Db.ConnectPostgres()
            await this.AuthenticateUserRequestor()
            await this.ValidateUserRequestor({})

            const credentials = SystemService.GetCredentials({
                isAdmRoot: this.UserAuth!.PermissionLevel!.Value === 4
            })

            await ResponseMessage.Success({
                responseData: credentials,
                responseLog: ACTION,
                expressResponse: this.RES
            })
    
            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            await ResponseMessage.InternalServerError({
                responseData: (ex as Error).message,
                responseLog: ACTION,
                expressResponse: this.RES
            })
        }
    }

    async GetForm()
    {
        const ACTION = `${ this.AppServiceAction } / Captura Formulário`
        try
        {
            await this.AuthenticateSystemRequestor()

            const formName = this.GetReqParamValue("form")

            if (IsNil(formName))
            {
                await ResponseMessage.SendNullField({
                    expressResponse: this.RES,
                    fields: ["form"],
                    responseLog: ACTION
                })
            }

            const form = FormService.Get({
                formName: formName!
            })

            await ResponseMessage.Success({
                responseData: form,
                responseLog: ACTION,
                expressResponse: this.RES
            })
        }
        catch (ex)
        {
            await ResponseMessage.InternalServerError({
                responseData: (ex as Error).message,
                responseLog: ACTION,
                expressResponse: this.RES
            })
        }
    }
}
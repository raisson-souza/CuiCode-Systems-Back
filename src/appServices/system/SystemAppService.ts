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
            await this.Db.ConnectPostgres()

            const parameters = await SystemService.GetParameters({
                Db: this.Db
            })

            if (parameters.SystemUnderMaintence)
            {
                ResponseMessage.Send({
                    expressResponse: this.RES,
                    data: false,
                    log: ACTION,
                    status: HttpStatusEnum.UNAVAIALBLE
                })
            }
        
            ResponseMessage.Send({
                expressResponse: this.RES,
                data: true,
                log: ACTION,
                status: HttpStatusEnum.OK
            })
    
            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            ResponseMessage.Send({
                expressResponse: this.RES,
                data: false,
                log: ACTION,
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR
            })
        }
    }

    async SystemStyle()
    {
        const ACTION = `${ this.AppServiceAction } / Estilo atual do Sistema`
        try
        {
            await this.Db.ConnectPostgres()

            const systemStyles = await SystemService.GetSystemsStyles({
                Db: this.Db
            })

            const actualSystemStyle = await SystemService.DetermineActualSystemStyle({
                Db: this.Db,
                systemStyles: systemStyles
            })

            ResponseMessage.Send({
                expressResponse: this.RES,
                data: actualSystemStyle.FrontEndConvertedStyle(),
                log: ACTION,
                status: HttpStatusEnum.OK
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            ResponseMessage.Send({
                expressResponse: this.RES,
                data: SystemService.DefaultSystemStyle,
                log: ACTION,
                status: HttpStatusEnum.OK
            })
        }
    }

    async DeactivateModule()
    {
        const ACTION = `${ this.AppServiceAction } / Desativação de Módulo`
        try
        {
            await this.Db.ConnectPostgres()

            const activateModule = this.REQ.query["active"] as string
            const moduleNumber = this.REQ.query["module"] as string

            if (IsNil(activateModule) || IsNil(moduleNumber))
            {
                ResponseMessage.SendInvalidField({
                    expressResponse: this.RES,
                    fields: ["active", "module"],
                    log: ACTION,
                })
            }
            
            await this.AuthenticateUserRequestor()
            this.ValidateUserRequestor({})

            await SystemService.DeactivateModule({
                Db: this.Db,
                active: ToBool(activateModule),
                module: ModulesEnumParser(moduleNumber)
            })

            const message = `Módulo ${ ToBool(activateModule) ? "ativado" : "desativado" } com sucesso.`

            ResponseMessage.Send({
                expressResponse: this.RES,
                data: message,
                log: ACTION,
                status: HttpStatusEnum.OK
            })
    
            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            ResponseMessage.Send({
                expressResponse: this.RES,
                data: (ex as Error).message,
                log: ACTION,
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR
            })
        }
    }

    async SystemUnderMaintence()
    {
        const ACTION = `${ this.AppServiceAction } / Sistema em Manutenção`
        try
        {
            const systemUnderMaintence = ToBool(this.REQ.body["maintence"] as string)

            if (IsNil(systemUnderMaintence))
            {
                ResponseMessage.SendNullField({
                    expressResponse: this.RES,
                    fields: ["maintence"],
                    log: ACTION
                })
            }

            await this.Db.ConnectPostgres()

            await this.AuthenticateUserRequestor()
            this.ValidateUserRequestor({
                level: PermissionLevelEnum.Root
            })

            await SystemService.SystemUnderMaintence({
                Db: this.Db,
                maintence: systemUnderMaintence
            })

            ResponseMessage.Send({
                expressResponse: this.RES,
                data: null,
                log: ACTION,
                status: HttpStatusEnum.OK
            })

            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            ResponseMessage.Send({
                expressResponse: this.RES,
                data: (ex as Error).message,
                log: ACTION,
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR
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
            this.ValidateUserRequestor({})

            const credentials = SystemService.GetCredentials({
                isAdmRoot: this.UserAuth!.PermissionLevel!.Value === 4
            })

            ResponseMessage.Send({
                expressResponse: this.RES,
                data: credentials,
                log: ACTION,
                status: HttpStatusEnum.OK
            })
    
            await this.Db.DisconnectPostgres()
        }
        catch (ex)
        {
            ResponseMessage.Send({
                expressResponse: this.RES,
                data: (ex as Error).message,
                log: ACTION,
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR
            })
        }
    }

    async GetForm()
    {
        const ACTION = `${ this.AppServiceAction } / Captura Formulário`
        try
        {
            this.AuthenticateSystemRequestor()

            const formName = this.REQ.params["form"]

            if (IsNil(formName))
            {
                ResponseMessage.SendNullField({
                    expressResponse: this.RES,
                    fields: ["form"],
                    log: ACTION
                })
            }

            const form = FormService.Get({
                formName: formName
            })

            ResponseMessage.Send({
                expressResponse: this.RES,
                data: form,
                log: ACTION,
                status: HttpStatusEnum.OK
            })
        }
        catch (ex)
        {
            ResponseMessage.Send({
                expressResponse: this.RES,
                data: (ex as Error).message,
                log: ACTION,
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR
            })
        }
    }
}
import AppServiceBase from "../base/AppServiceBase"
import DatabaseService from "../../services/system/DatabaseService"
import ResponseMessage from "../../classes/system/ResponseMessage"

import IDatabaseAppService from "./IDatabaseAppService"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"
import PermissionLevelEnum from "../../enums/PermissionLevelEnum"

export default class DatabaseAppService extends AppServiceBase implements IDatabaseAppService
{
    AppServiceAction = "Base de Dados"

    async FoundCuiCodeSystemsDatabase()
    {
        const ACTION = `${ this.AppServiceAction } / Criação da Base de Dados`
        try
        {
            this.AuthenticateSystemRequestor()

            await this.Db.ConnectPostgres()

            await DatabaseService.FoundCuiCodeSystemsDatabase({
                Db: this.Db
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
}
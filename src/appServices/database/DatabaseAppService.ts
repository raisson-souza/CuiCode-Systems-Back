import AppServiceBase from "../base/AppServiceBase"
import DatabaseService from "../../services/system/DatabaseService"
import ResponseMessage from "../../classes/system/ResponseMessage"

import IDatabaseAppService from "./IDatabaseAppService"

export default class DatabaseAppService extends AppServiceBase implements IDatabaseAppService
{
    AppServiceAction = "Base de Dados"

    async FoundCuiCodeSystemsDatabase()
    {
        const ACTION = `${ this.AppServiceAction } / Criação da Base de Dados`
        try
        {
            await this.AuthenticateSystemRequestor()
            await this.Db.ConnectPostgres()
            await this.Db.ConnectSqlite()

            await DatabaseService.FoundCuiCodeSystemsDatabase({
                Db: this.Db
            })

            await DatabaseService.CreateErrorLogDatabase({
                Db: this.Db
            })

            await ResponseMessage.Success({
                responseData: null,
                responseLog: ACTION,
                expressResponse: this.RES
            })

            await this.Db.DisconnectPostgres()
            await this.Db.DisconnectSqlite()
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
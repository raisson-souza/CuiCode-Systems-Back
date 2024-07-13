
import DB from '../db/DB'
import SystemError from '../entities/system/SystemError'
import SystemErrorService from '../../services/system/SystemErrorService'

type SaveErrorLogProps = {
    errorMessage : string
    errorLog : string
}

export default abstract class Exception
{
    static async SaveErrorLog(props : SaveErrorLogProps)
    {
        const { errorLog, errorMessage } = props

        const Database = new DB()
        await Database.ConnectSqlite()

        const error = new SystemError({
            "message": errorMessage,
            "log": errorLog
        })

        // A desenvolver
        await SystemErrorService.Save({
            Db: Database,
            error: error
        })

        await Database.DisconnectSqlite()
    }
}
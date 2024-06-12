import fs from 'fs/promises'

import GetCompleteDate from '../../functions/date/GetCompleteDate'

abstract class Exception
{
    private static async SaveLog(errorMessage : string, action : string)
    {
        // TODO: REAJUSTAR (retornar ao original)
        // const date = GetCompleteDate()
        // const dirPath = `./src/logs/${ date.year }/${ date.month }/${ date.day }/`

        // try
        // {
        //     fs.lstat(dirPath)
        // }
        // catch
        // {
        //     fs.mkdir(dirPath, { recursive: true })
        // }

        // const log = `${ date.completeDate } | ${ action } | ${ errorMessage } \n`

        // try
        // {
        //     fs.writeFile(
        //         `${ dirPath }/error_log.txt`,
        //         log,
        //         { flag: 'a' }
        //     )
        // }
        // catch { }
    }

    static Error(
        msg : string,
        action : string
    )
    {
        this.SaveLog(msg, action)
        throw new Error(msg)
    }

    static UnexpectedError(msg : string, action : string) { this.SaveLog(msg, action) }
}

export default Exception
import fs from 'fs/promises'

import FormatZeros from '../../functions/formatting/FormatZeros'
import GetDate from '../../functions/GetDate'

abstract class Exception
{
    private static async SaveLog(errorMessage : string, action : string)
    {
        const date = GetDate()
        const fileName = `./src/logs/${ TodayDate() }_error_log.txt`
        const log = `${ date } | ${ action } | ${ errorMessage } \n`

        try
        {
            await fs.writeFile(fileName, log, { flag: 'a' })
        }
        catch (ex)
        {
            console.log(ex)
        }
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

function TodayDate()
{
    const date = new Date()
    const year = date.getFullYear()
    const month = (date.getMonth() + 1)
    const day = date.getDate()

    return `${ FormatZeros(day, 2) }-${ FormatZeros(month, 2) }-${ year }`
}

export default Exception
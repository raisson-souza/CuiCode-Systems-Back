/**
 * Converts a Date to SQL timestamp format.
 * @param date 
 * @returns 
 */
function ToSqlTimestamp(date : Date)
{
    const newDate = new Date(date).getTime() / 1000

    return `to_timestamp('${newDate}')`
}

export default ToSqlTimestamp

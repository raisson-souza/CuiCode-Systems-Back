/**
 * Converts a Date to SQL timestamp format.
 */
export default function ToSqlTimestamp(date : Date)
{
    const newDate = new Date(date).getTime() / 1000

    return `to_timestamp('${newDate}')`
}

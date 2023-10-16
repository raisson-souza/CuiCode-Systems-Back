/**
 * Converts a Date to a acceptable SQL date format.
 */
export default function ToSqlDate(date : Date)
{
    const newDate = new Date(date).toLocaleDateString()

    return `to_date('${ newDate }', 'dd MM yyyy')`
}

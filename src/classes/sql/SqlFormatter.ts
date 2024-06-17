import FillZeros from "../../functions/formatting/FillZeros"
import Label from "../entities/base/Label"

type EntryToQueryProps = {
    value : any,
    isValueDate? : boolean
    isValueTimestamp? : boolean
}

export default abstract class SqlFormatter
{
    /**
     * Converte o valor de um SQL para string em uma query baseado no seu tipo.
     */
    static EntryToQuery({
        value,
        isValueDate = false,
        isValueTimestamp = false,
    } : EntryToQueryProps) : string
    {
        if (value instanceof Label)
            return String(value.Value)
        else if (value instanceof Date)
        {
            return isValueTimestamp
                ? SqlFormatter.ToSqlTimestamp(value)
                : SqlFormatter.ToSqlDate(value)
        }
        else
        {
            switch (typeof value)
            {
                case "string":
                    return isValueDate || isValueTimestamp
                        ? isValueTimestamp
                            ? SqlFormatter.ToSqlTimestamp(value)
                            : SqlFormatter.ToSqlDate(value)
                        : `'${ value }'`
                case "boolean":
                    return `'${ value }'`
                case "number":
                    return `${ value }`
                default:
                    return `'${ value }'`
            }
        }
    }

    /** Converte uma data para um valor de data SQL query friendly. */
    static ToSqlDate(date : Date | string) : string
    {
        return `to_date('${ new Date(date).toLocaleDateString() }', 'dd MM yyyy')`
    }

    /** Converte uma data para um valor de timestamp SQL friendly. */
    static ToSqlTimestamp(date : Date | string)
    {
        return `to_timestamp('${ new Date(date).getTime() / 1000 }')`
    }

    /** Transforma uma data em uma qeury de comparação de datas. Ex: 2024-01-01 00:00:00.000 */
    static ToSqlDateComparison(date : Date | string) : string
    {
        if (typeof date === 'string') date = new Date(date)

        const month = FillZeros(date.toLocaleString().split("/")[1])
        const day = FillZeros(date.toLocaleString().split("/")[0])
        const hour = FillZeros(date.toLocaleString().split(" ")[1].split(":")[0])
        const minute = FillZeros(date.toLocaleString().split(" ")[1].split(":")[1])
        const second = FillZeros(date.toLocaleString().split(" ")[1].split(":")[2])
        const milissecond = FillZeros(date.getMilliseconds(), 3)
        return `${ date.getFullYear() }-${ month }-${ day } ${ hour }:${ minute }:${ second }.${ milissecond }`
    }
}
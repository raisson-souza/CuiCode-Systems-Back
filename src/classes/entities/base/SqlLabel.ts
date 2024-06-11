import Label from "./Label"

/**
 * Armazena o nome da coluna, o valor da mesma e o tipo.
 * Uso em SQL.
 */
class SqlLabel
{
    ColumnName : string
    ColumnValue : any
    ColumnType : string

    constructor(columnName: string, columnValue: any)
    {
        columnValue = this.ValidateValue(columnValue)
        this.ColumnName = columnName
        this.ColumnValue = columnValue
        this.ColumnType = typeof(columnValue)
    }

    /**
     * Valida e corrige o valor rebido caso seja instância de Label, para o valor da mesma.
     * @param value 
     * @returns 
     */
    ValidateValue(value : any) : any
    {
        return (value instanceof Label)
            ? (value as Label).Value
            : value
    }

    /**
     * Converte o valor de um SQL para string em uma query baseado no seu tipo.
     */
    ParsePropNameToSql() : string
    {
        switch (this.ColumnType)
        {
            case "string":
            case "boolean":
                return `'${ this.ColumnValue }'`
            case "number":
                return this.ColumnValue
            default:
                return `'${ this.ColumnValue }'`
        }
    }

    /**
     * Converte o valor de um SQL para string em uma query baseado no seu tipo.
     */
    static ParsePropNameToSql(valueType : string, value : any) : string
    {
        if (value instanceof Label)
            return String(value.Value)

        switch (valueType)
        {
            case "string":
            case "boolean":
                return `'${ value }'`
            case "number":
                return value
            default:
                return `'${ value }'`
        }
    }
}

export default SqlLabel
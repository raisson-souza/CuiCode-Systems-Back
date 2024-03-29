import Label from "./Label"
import SqlLabel from "./SqlLabel"

class EntityLog
{
    OldValue : {
        SQLValue : SqlLabel,
        ModelValue : EntityProperty
    }
    NewValue : {
        SQLValue : SqlLabel,
        ModelValue : EntityProperty
    }

    constructor
    (
        propertyName : string,
        oldValue : any,
        newValue : any
    )
    {
        this.OldValue = {
            SQLValue : new SqlLabel(propertyName, oldValue),
            ModelValue : new EntityProperty(propertyName, oldValue)
        }
        this.NewValue = {
            SQLValue : new SqlLabel(propertyName, newValue),
            ModelValue : new EntityProperty(propertyName, newValue)
        }
    }

    static GetProperyValue
    (
        propertyNames : string[],
        logs : EntityLog[]
    )
    : { OldValue : any, NewValue : any }
    {
        let oldValue : any = null
        let newValue : any = null

        for (let i = 0; i < logs.length; i++)
        {
            const propLog = logs[i]
            if (propertyNames.includes(propLog.OldValue.ModelValue.Property))
            {
                oldValue = logs[i].OldValue.ModelValue.Value
                newValue = logs[i].NewValue.ModelValue.Value
                break
            }
        }

        return { OldValue : oldValue, NewValue : newValue }
    }

    static ConvertJsonToString(log : EntityLog[])
    {
        function ParseValue(value : any)
        {
            if (value instanceof Label)
                return value.Value

            return value
        }

        let json = "{"

        log.forEach((prop, i) => {
            json += `"${ prop.OldValue.SQLValue.ColumnName }": ["${ ParseValue(prop.OldValue.ModelValue.Value) }","${ ParseValue(prop.NewValue.ModelValue.Value) }"]${ i == log.length - 1 ? "" : "," }`
        })

        json += "}"

        return json
    }

    static BuildSqlQuery(entityLog : EntityLog[])
    {
        let query = ""

        entityLog.forEach((log, i) => {
            query += `"${ log.NewValue.SQLValue.ColumnName }" = ${ log.NewValue.SQLValue.ParsePropNameToSql() }${ i < entityLog.length - 1 ? ", " : " "}`
        })

        return query
    }

    static RetrieveNewValuesInModel(entityLog : EntityLog[])
    {
        const model : any = {}

        entityLog.forEach(log => {
            model[log.NewValue.ModelValue.Property] = log.NewValue.ModelValue.Value
        })

        return model
    }
}

class EntityProperty
{
    Property : string
    Value : any

    constructor(propertyName : string, value : any)
    {
        this.Property = propertyName
        this.Value = value
    }
}

export { EntityLog, EntityProperty }
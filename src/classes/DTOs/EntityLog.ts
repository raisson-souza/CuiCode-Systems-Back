import SqlLabel from "../SqlLabel"

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
        propertyName : string,
        log : EntityLog[]
    )
    : { OldValue : any, NewValue : any }
    {
        let oldValue : any = null
        let newValue : any = null

        for (let i = 0; i < log.length - 1; i++)
        {
            const propLog = log[i]
            if (propLog.OldValue.ModelValue.Property === propertyName)
            {
                oldValue = log[i].OldValue.ModelValue.Value
                newValue = log[i].NewValue.ModelValue.Value
                break
            }
        }

        return { OldValue : oldValue, NewValue : newValue }
    }

    static ConvertJsonToString(log : EntityLog[])
    {
        let json = "{"

        log.forEach((prop, i) => {
            json += `"${ prop.OldValue.SQLValue.ColumnName }": ["${ prop.OldValue.ModelValue.Value }","${ prop.NewValue.ModelValue.Value }"]${ i == log.length - 1 ? "" : "," }`
        })

        json += "}"

        return json
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
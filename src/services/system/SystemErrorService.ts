import SystemError from "../../classes/entities/system/SystemError"

import { ListProps, SaveProps } from "./types/ErrorServiceProps"

export default abstract class SystemErrorService
{
    static async Save(props : SaveProps) : Promise<void>
    {
        // const {
        //     error: {
        //         Message,
        //         Log
        //     }
        // } = props

        // const query = `INSERT INTO error_logs (message, log) VALUES ('${ Message }', '${ Log }')`

        // props.Db.SqliteDb.run(query, ex => {
        //     if (!IsNil(ex))
        //         throw new Error(ex!.message)
        // })
    }

    static async List(props : ListProps) : Promise<SystemError[]>
    {
        // const query = `SELECT * FROM error_logs`
        const errors : SystemError[] = []

        // props.Db.SqliteDb.all(query, (ex, res) => {
        //     if (!IsNil(ex))
        //         throw new Error(ex!.message)

        //     res.forEach(row => {
        //         errors.push(new SystemError(row))
        //     })
        // })

        return errors
    }
}
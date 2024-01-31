import { Client } from "pg"

import DateCustom from "../../../../classes/custom/DateCustom"
import Operation from "../../../../classes/service/base/Operation"
import ResponseMessage from "../../../../classes/DTOs/ResponseMessage"
import ServerClientService from "../../../../classes/service/ServerClientService"
import User from "../../../../classes/entities/user/User"

import IsUndNull from "../../../../functions/IsUndNull"

import HttpStatusEnum from "../../../../enums/system/HttpStatusEnum"
import PermissionLevelEnum from "../../../../enums/PermissionLevelEnum"

class GetUserLogsService extends ServerClientService
{
    Action = "Consulta de logs de usuário."

    CheckBody() { throw new Error("Method not implemented.") }

    CheckQuery()
    : {
        UserId : number,
        StartDate : DateCustom | null,
        FinalDate : DateCustom | null
    }
    {
        try
        {
            const query = this.REQ.query as any

            let startDate = null; let finalDate = null;

            if (IsUndNull(query.userId))
            {
                ResponseMessage.SendNullField(["userId"], this.Action, this.RES)
                throw new Error("ID de usuário não encontrado.")
            }

            if (!IsUndNull(query.startDate))
                startDate = new DateCustom(query.startDate)

            if (!IsUndNull(query.finalDate))
                finalDate = new DateCustom(query.finalDate)

            return {
                UserId: Number.parseInt(query.userId),
                StartDate : startDate,
                FinalDate : finalDate
            }
        }
        catch
        {
            throw new Error("Datas informadas para filtro inválidas.")
        }
    }

    async Operation()
    {
        try
        {
            const {
                RES,
                DB_connection,
                Action
            } = this

            await this.AuthenticateRequestor()

            const filterProps = this.CheckQuery()

            const user = new User({ Id: filterProps.UserId })

            this.ValidateRequestor(PermissionLevelEnum.Member, user.Id, true)

            await Promise.resolve(new GetUserLogsOperation(user, DB_connection, filterProps.StartDate, filterProps.FinalDate).PerformOperation())
                .then(result => {
                    ResponseMessage.Send(
                        HttpStatusEnum.OK,
                        result,
                        Action,
                        RES
                    )
                })
                .catch(ex => {
                    throw new Error((ex as Error).message)
                })
        }
        catch (ex)
        {
            ResponseMessage.Send(
                HttpStatusEnum.INTERNAL_SERVER_ERROR,
                `Houve um erro ao consultar os logs do usuário. Erro: ${ (ex as Error).message }`,
                this.Action,
                this.RES
            )
        }
        finally
        {
            this.DB_connection.end()
        }
    }
}

class GetUserLogsOperation extends Operation
{
    StartDate : DateCustom | null
    FinalDate : DateCustom | null

    constructor
    (
        user : User | null,
        db_connection : Client,
        startDate : DateCustom | null,
        finalDate : DateCustom | null
    )
    {
        super(user, db_connection)
        this.StartDate = startDate
        this.FinalDate = finalDate
    }

    async PerformOperation()
    {
        try
        {
            const { DB_connection } = this

            if (IsUndNull(this.User!.Id))
                throw new Error("Id do usuário a ser consultado deve ser informado.")

            const query = this.BuildQuery()

            return await DB_connection.query(query)
                .then(result => {
                    if (result.rowCount == 0)
                        return "Nenhuma edição encontrada nesse usuário."

                    try
                    { // 3 horas substraidas do registro devido a problemas com zona de tempo.
                        result.rows.forEach(row => { (row["date"] as Date).setHours((row["date"] as Date).getHours() - 3) })
                    } catch { }

                    return result.rows
                })
                .catch(ex => {
                    throw new Error((ex as Error).message)
                })
        }
        catch (ex)
        {
            throw new Error((ex as Error).message)
        }
    }

    private BuildQuery()
    {
        const baseQuery = `SELECT id, "change", "date", "adm_change" FROM users_logs WHERE user_id = ${ this.User!.Id } `

        if (IsUndNull(this.StartDate) && IsUndNull(this.FinalDate))
            return baseQuery

        else if (!IsUndNull(this.StartDate))
            return baseQuery + `AND "date" > '${ this.StartDate!.toSqlComparison() }'`

        else if (!IsUndNull(this.FinalDate))
            return baseQuery + `AND "date" < '${ this.FinalDate!.toSqlComparison() }'`

        return baseQuery + `AND "date" > '${ this.StartDate!.toSqlComparison() }' AND "date" < '${ this.FinalDate!.toSqlComparison() }'`
    }
}

export default GetUserLogsService
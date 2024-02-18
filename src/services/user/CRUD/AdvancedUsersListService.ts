import Exception from "../../../classes/custom/Exception"
import ResponseMessage from "../../../classes/system/ResponseMessage"
import ServerService from "../../../classes/service/ServerService"
import User from "../../../classes/entities/user/User"

import IsUndNull from "../../../functions/logic/IsUndNull"
import ParseSqlArrayParams from "../../../functions/SQL/ParseSqlArrayParams"

import HttpStatusEnum from "../../../enums/system/HttpStatusEnum"
import UsersFilterEnum from "../../../enums/modules/UsersFilterEnum"
import UsersVisualizationEnum from "../../../enums/modules/UsersVisualizationEnum"

/**
 * Listagem avançada de usuários.
 */
class AdvancedUsersListService extends ServerService
{
    Action = "Listagem avançada de usuários."

    CheckBody() { }

    CheckQuery()
    {
        const { Action } = this

        const filterType = Number.parseInt(this.REQ.query["FilterType"] as string)
        const visualizationType = Number.parseInt(this.REQ.query["VisualizationType"] as string)

        if (IsUndNull(filterType) || IsUndNull(visualizationType))
            ResponseMessage.SendNullField(["FilterType", "VisualizationType"], Action, this.RES)

        return {
            "filterType": filterType,
            "visualizationType": visualizationType
        }
    }

    CheckParams() { }

    async Operation()
    {
        try
        {
            const {
                DB_connection,
                Action
            } = this

            this.AuthenticateRequestor()

            const {
                filterType,
                visualizationType
            } = this.CheckQuery()

            const {
                join,
                photoSelect,
                photoWhere
            } = this.BuildJoin(visualizationType, filterType)

            const select : string[] = this.BuildSelect(visualizationType, photoSelect)
            const where : string[] = this.BuildWhere(filterType, photoWhere)

            const query = this.BuildQuery(
                select,
                where,
                join
            )

            const users : any = []

            await DB_connection.query(query)
                .then(result => {
                    result.rows.forEach(user => {
                        users.push(new User(user).ShowPopulatedPropsOnly())
                    })
                })

            ResponseMessage.Send(
                HttpStatusEnum.OK,
                users,
                Action,
                this.RES
            )
        }
        catch (ex)
        {
            ResponseMessage.Send(
                HttpStatusEnum.INTERNAL_SERVER_ERROR,
                `Houve um erro ao listar os usuários. Erro: ${ (ex as Error).message }`,
                this.Action,
                this.RES
            )
            Exception.UnexpectedError((ex as Error).message, this.Action)
        }
        finally
        {
            this.DB_connection.end()
        }
    }

    private BuildSelect
    (
        visualizationType : number,
        photoSearch : boolean
    )
    {
        // "u.id", "u.active", "u.birthdate", "u.created", "u.deleted", "u.email_approved", "u.email", "u.modified_by", "u.modified", "u.name", "u.password_hint", "u.password", "u.permission_level", "u.phone", "u.photo_base_64", "u.recovery_email", "u.sex", "u.username"
        const select : string[] = ["u.id", "u.created", "u.permission_level", "u.username"]

        if (photoSearch) select.push("up.photo_base_64")

        switch (visualizationType)
        {
            case UsersVisualizationEnum.Absolute:
                return [ ...select, "u.birthdate", "u.email", "u.modified", "u.name", "u.phone", "u.recovery_email", "u.sex"]

            case UsersVisualizationEnum.Presentation:
                return [ ...select, "u.birthdate", "u.email", "u.name", "u.sex"]

            case UsersVisualizationEnum.List:
                return [ ...select, "u.birthdate", "u.email", "u.name", "u.sex"]

            case UsersVisualizationEnum.Resume:
                return [ ...select, "u.name"]

            case UsersVisualizationEnum.Queote:
                return [ ...select ]

            case UsersVisualizationEnum.QueoteWithoutPhoto:
                return [ ...select ]

            default:
                return [ ...select ]
        }
    }

    private BuildWhere
    (
        filterType : number,
        photoSearch : boolean
    )
    {
        // "u.id", "u.active", "u.birthdate", "u.created", "u.deleted", "u.email_approved", "u.email", "u.modified_by", "u.modified", "u.name", "u.password_hint", "u.password", "u.permission_level", "u.phone", "u.photo_base_64", "u.recovery_email", "u.sex", "u.username"
        const previusActiveUsers = ["u.active = true", "u.deleted = false"]

        switch (filterType) {
            case UsersFilterEnum.AllActive:
                return previusActiveUsers

            case UsersFilterEnum.AllDeleted:
                return ["u.deleted = true"]

            case UsersFilterEnum.AllInactive:
                return ["u.active = false", "u.deleted = false"]

            case UsersFilterEnum.AllEmailApproved:
                return [ ...previusActiveUsers, "u.email_approved = true"]

            case UsersFilterEnum.AllEmailUnnaproved:
                return [ ...previusActiveUsers, "u.email_approved = false"]

            case UsersFilterEnum.AllMonthBirthdays:
                return [ ...previusActiveUsers, "extract(MONTH FROM u.birthdate) = extract(MONTH FROM CURRENT_DATE)"]

            case UsersFilterEnum.AllAdms:
                return [ ...previusActiveUsers, "permission_level IN (3, 4)"]

            case UsersFilterEnum.AllMembers:
                return [ ...previusActiveUsers, "permission_level = 2"]

            case UsersFilterEnum.AllWithPhoto:
                return photoSearch
                    ? [ ...previusActiveUsers, "up.photo_base_64 IS NOT NULL"]
                    : previusActiveUsers

            case UsersFilterEnum.AllWithoutPhoto:
                return photoSearch
                    ? [ ...previusActiveUsers, "up.photo_base_64 IS NULL"]
                    : previusActiveUsers

            case UsersFilterEnum.AllWomen:
                return [ ...previusActiveUsers, "sex = 2"]

            case UsersFilterEnum.AllMen:
                return [ ...previusActiveUsers, "sex = 1"]

            default:
                return previusActiveUsers
        }
    }

    private BuildJoin
    (
        visualizationType : number,
        filterType : number
    )
    {
        let join = ""
        let photoSelect = false
        let photoWhere = false

        switch (filterType)
        {
            case UsersFilterEnum.AllWithPhoto:
            case UsersFilterEnum.AllWithoutPhoto:
                photoWhere = true
                break
            default:
                break
        }

        switch (visualizationType)
        {
            case UsersVisualizationEnum.Presentation:
            case UsersVisualizationEnum.Queote:
                photoSelect = true
                break
            default:
                break
        }

        if (photoSelect || photoWhere)
            join = 'FULL JOIN users_photos up ON u.id = up.user_id'

        return {
            "join": join,
            "photoSelect": photoSelect,
            "photoWhere": photoWhere
        }
    }

    private BuildQuery
    (
        select : string[],
        where : string[],
        join : string,
    ) : string
    {
        const selectQuery = ParseSqlArrayParams(select)
        const whereQuery = ParseSqlArrayParams(where, " AND ")

        return `SELECT ${ selectQuery } FROM users u ${ join } WHERE ${ whereQuery } ORDER BY u.id ASC`
    }
}

export default AdvancedUsersListService
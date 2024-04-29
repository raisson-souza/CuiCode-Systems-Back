import ClientService from "../../../../classes/service/ClientService"
import Exception from "../../../../classes/custom/Exception"
import ResponseMessage from "../../../../classes/system/ResponseMessage"
import UserBase from "../../../../classes/bases/UserBase"

import HttpStatusEnum from "../../../../enums/system/HttpStatusEnum"

/**
 * Captura as informações diárias de um usuário.
 */
class DailyInfoService extends ClientService
{
    Action = "Informações diárias."

    CheckBody() { }

    CheckQuery() { }

    CheckParams() { }

    async Operation()
    {
        try
        {
            await this.AuthenticateRequestor()

            const groupsIncluded = await UserBase.GetUserParticipatingGroups({
                db: this.DB_connection,
                userId: this.USER_auth!.Id
            })

            const mySolicitations = await UserBase.GetUserAttendantSolicitations({
                db: this.DB_connection,
                userId: this.USER_auth!.Id
            })

            mySolicitations.concat(await UserBase.GetUserByGroupAttendantSolicitations({
                db: this.DB_connection,
                userId: this.USER_auth!.Id
            }))

            // const myDelayedSolicitations = mySolicitations
            //     .filter(solicitation => {
            //         solicitation.final_date.getTime() < new Date().getTime()
            //     })
            //     .map(delayedSolicitation => { return delayedSolicitation })

            const myDelayedSolicitations : never[] = [] // MOCK

            const userParticipatingChats = await UserBase.GetUserParticipatingChats({
                db: this.DB_connection,
                userId: this.USER_auth!.Id
            })

            const userDreams = await UserBase.GetUserMorfeus({
                db: this.DB_connection,
                userId: this.USER_auth!.Id
            })

            // const hestia = await UserBase.GetUserHestia({ // HestiaBase retornará especifico do usuario por data
            //     db: this.DB_connection,
            //     userId: this.USER_auth!.Id
            // })

            const hestiaTasksThisWeek  : never[]= [] // MOCK
            const hestiaTasksPending : never[] = [] // MOCK

            // const minerva = await UserBase.GetUserMinerva({ // MinervaBase retornará planos não-concluidos por usuario
            //     db: this.DB_connection,
            //     userId: this.USER_auth!.Id
            // })

            const minervaOpenPlans : never[] = [] // MOCK

            const response = { // Realizar Map() de cada um retornar Id e Name (conforme documentação)
                groupsIncluded,
                mySolicitations,
                myDelayedSolicitations,
                userParticipatingChats, // Quantidade
                userDreams, // Quantidade
                hestiaTasksThisWeek, // Quantidade
                hestiaTasksPending, // Quantidade
                minervaOpenPlans // Quantidade
            }

            ResponseMessage.Send({
                status: HttpStatusEnum.OK,
                data: response,
                log: this.Action,
                expressResponse: this.RES
            })
        }
        catch (ex)
        {
            ResponseMessage.Send({
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR,
                data: null,
                log: this.Action,
                expressResponse: this.RES
            })
            Exception.UnexpectedError((ex as Error).message, this.Action)
        }
        finally
        {
            this.DB_connection.end()
        }
    }
}

export default DailyInfoService
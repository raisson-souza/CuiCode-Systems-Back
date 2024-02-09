import Exception from "../../classes/custom/Exception"
import Parameters from "../../classes/entities/system/Parameters"
import ResponseMessage from "../../classes/system/ResponseMessage"
import ServerService from "../../classes/service/ServerService"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"

/**
 * Verifica a integridade.
 */
class OkService extends ServerService
{
    Action = "Estado do Sistema."

    CheckBody() { }

    CheckQuery() { }

    async Operation()
    {
        try
        {
            const { Action, RES } = this

            await this.DB_connection.query("SELECT system_under_maintence FROM parameters")
                .then(result => {
                    const parameters = new Parameters(result.rows[0])

                    if (parameters.SystemUnderMaintence)
                        ResponseMessage.Send(
                            HttpStatusEnum.UNAVAIALBLE,
                            "Sistema em Manutenção.",
                            Action,
                            RES
                        )

                    ResponseMessage.Send(
                        HttpStatusEnum.OK,
                        null,
                        Action,
                        RES
                    )
                })
        }
        catch (ex)
        {
            ResponseMessage.Send(
                HttpStatusEnum.INTERNAL_SERVER_ERROR,
                `Houve um erro ao consultar o estado do sistema. Erro: ${ (ex as Error).message }`,
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
}

export default OkService
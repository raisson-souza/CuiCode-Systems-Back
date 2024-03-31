import Exception from "../../classes/custom/Exception"
import Parameters from "../../classes/entities/system/Parameters"
import ResponseMessage from "../../classes/system/ResponseMessage"
import ServerService from "../../classes/service/ServerService"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"

/**
 * Verifica o estado do sistema.
 */
class OkService extends ServerService
{
    Action = "Estado do Sistema."

    CheckBody() { }

    CheckQuery() { }

    CheckParams() { }

    async Operation()
    {
        try
        {
            // Aqui não será utilizado ParametersBase para obter-se maior precisão na busca levando
            // em conta o propósito da OkService.
            await this.DB_connection.query("SELECT * FROM parameters")
                .then(result => {
                    const parameters = new Parameters(result.rows[0])

                    if (parameters.SystemUnderMaintence) {
                        ResponseMessage.Send({
                            status: HttpStatusEnum.UNAVAIALBLE,
                            data: "Sistema em Manutenção.",
                            log: this.Action,
                            expressResponse: this.RES
                        })
                    }

                    ResponseMessage.Send({
                        status: HttpStatusEnum.OK,
                        data: null,
                        log: this.Action,
                        expressResponse: this.RES
                    })
                })
        }
        catch (ex)
        {
            ResponseMessage.Send({
                status: HttpStatusEnum.INTERNAL_SERVER_ERROR,
                data: `Houve um erro ao consultar o estado do sistema. Erro: ${ (ex as Error).message }`,
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

export default OkService
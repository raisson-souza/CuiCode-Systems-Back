import {
    BadFieldsResponseProps,
    BuildFieldsInfoMessageProps,
    DefaultResponseProps,
    FinalResponseMessage,
    FixTimeZoneProps,
    GenericHttpResponseProps,
    RenderDataLengthProps,
    RenderSuccessProps,
    SendProps,
} from "../../types/ResponseMessage"

import FindValue from "../../functions/logic/FindValue"
import IsNil from "../../functions/logic/IsNil"
import IsUndNull from "../../functions/logic/IsUndNull"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"

import Exception from "./Exception"

abstract class ResponseMessage
{
    /**
     * Realiza o envio final da response.
     */
    static async Send(props : SendProps) : Promise<void>
    {
        const {
            responseLog,
            responseStatus,
            expressResponse,
            responseDataPropToCount
        } = props
        let { responseData } = props

        // Caso a response já tenha sido enviada, retorna
        if (expressResponse.headersSent)
            return

        responseData = this.FixTimeZone({ // TODO: validar necessidade no caso do send.json
            responseData: responseData
        })

        const success = this.RenderSuccess({
            responseStatus: responseStatus
        })

        const length = this.RenderDataLength({
            responseData: responseData,
            responseSuccess: success,
            responseDataPropToCount: responseDataPropToCount
        })

        // Montagem da response final
        const finalResponse : FinalResponseMessage = {
            data: responseData,
            length: length,
            success: success,
            responseLog: responseLog
        }

        // Envio da response
        expressResponse
            .status(responseStatus)
            .json(finalResponse)

        // Gravação do log da response no console
        console.log(`${ success ? "OK" : "ERROR" } | ${ new Date().toString() } | STATUS ${ responseStatus } | ${ responseLog }`)

        // TODO: A desenvolver
        // Gravação do erro no sqlite
        await Exception.SaveErrorLog({
            errorMessage: responseData,
            errorLog: responseLog
        })
    }

    /** Método para tratamento de erro no fuso horário (problema causado pelo send() do express). */
    private static FixTimeZone(props : FixTimeZoneProps)
    {
        const { responseData } = props
        try
        {
            if (responseData instanceof Array)
            {
                responseData.forEach(obj => {
                    if (obj instanceof Date)
                        obj.setHours(obj.getHours() - 3)
                })
            }

            if (responseData instanceof Date)
                responseData.setHours(responseData.getHours() - 3)

            if (typeof responseData === "object")
            {
                Object.entries(responseData).forEach(obj => {
                    if (obj[1] instanceof Date)
                        obj[1].setHours(obj[1].getHours() - 3)
                })
            }

            return responseData
        }
        catch { return responseData }
    }

    /** Retorna se o sucesso é verdadeiro ou não baseado no status da response. */
    private static RenderSuccess(props : RenderSuccessProps) : boolean
    {
        switch (props.responseStatus)
        {
            case HttpStatusEnum.OK:
            case HttpStatusEnum.ACCEPTED:
            case HttpStatusEnum.CREATED:
                return true
            case HttpStatusEnum.INVALID:
            case HttpStatusEnum.UNAUTHORIZED:
            case HttpStatusEnum.PROHIBITED:
            case HttpStatusEnum.NOT_FOUND:
            case HttpStatusEnum.INTERNAL_SERVER_ERROR:
            case HttpStatusEnum.NOT_IMPLEMENTED:
            case HttpStatusEnum.UNAVAIALBLE:
            default:
                return false
        }
    }

    /** Retorna a quantidade de itens a serem retornados, caso especificado um caso especial para tal contagem. */
    private static RenderDataLength(props : RenderDataLengthProps) : number
    {
        const { responseData, responseSuccess, responseDataPropToCount } = props
        if (!responseSuccess) return 0
        try
        {
            const parsedData = IsUndNull(responseDataPropToCount)
                ? responseData
                : FindValue(responseData, [responseDataPropToCount!])

            if (parsedData instanceof Array)
                return parsedData.length

            if (parsedData instanceof Object)
                return Object.keys(parsedData).length

            return 1
        }
        catch { return 1 }
    }

    /** Renderiza a mensagem de erro a ser montada sobre um ou mais campos de uma requisição irregulares. */
    private static BuildFieldsInfoMessage(props : BuildFieldsInfoMessageProps)
    {
        const { fieldsNames, singularMessage, pluralMessage } = props

        let response = fieldsNames.length === 1 ? "O campo " : "Os campos "

        fieldsNames.forEach((field, i) => {
            response += `${ field }${ i === fieldsNames.length - 1 ? " " : ", " }`
        })

        response += fieldsNames.length === 1 ? singularMessage : pluralMessage + "."

        return response
    }

    /** Response para campo inválido. */
    static async SendInvalidField(props : BadFieldsResponseProps)
    {
        const { fields, responseLog, expressResponse } = props
        let response = this.BuildFieldsInfoMessage({
            fieldsNames: fields,
            singularMessage: "está inválido",
            pluralMessage: "estão inválidos"
        })

        await this.Send({
            responseStatus: HttpStatusEnum.INVALID,
            responseData: response,
            expressResponse: expressResponse,
            responseLog: responseLog,
        })
    }

    /** Response para campo nulo. */
    static async SendNullField(props : BadFieldsResponseProps)
    {
        const { fields, responseLog, expressResponse } = props
        let response = this.BuildFieldsInfoMessage({
            fieldsNames: fields,
            singularMessage: "não pode ser nulo",
            pluralMessage: "não podem ser nulos"
        })

        await this.Send({
            responseStatus: HttpStatusEnum.INVALID,
            responseData: response,
            expressResponse: expressResponse,
            responseLog: responseLog,
        })
    }

    /** Response para rota não implementada. */
    static async NotImplementedRoute(props : GenericHttpResponseProps)
    {
        let { expressResponse, responseLog } = props

        if (IsNil(responseLog)) responseLog = "Operação não implementada."

        await this.Send({
            responseStatus: HttpStatusEnum.NOT_IMPLEMENTED,
            responseData: responseLog,
            expressResponse: expressResponse,
            responseLog: responseLog!,
        })
    }

    /** Response para usuário não autenticado. */
    static async UnauthorizedUser(props : GenericHttpResponseProps)
    {
        const { expressResponse, responseLog } = props
        const response = "Usuário não autenticado."

        await this.Send({
            responseStatus: HttpStatusEnum.UNAUTHORIZED,
            responseData: response,
            expressResponse: expressResponse,
            responseLog: responseLog!,
        })
    }

    /** Response para sistema não autenticado. */
    static async UnauthorizedSystem(props : GenericHttpResponseProps)
    {
        const { expressResponse, responseLog } = props
        const response = "Sistema não autenticado."

        await this.Send({
            responseStatus: HttpStatusEnum.UNAUTHORIZED,
            responseData: response,
            expressResponse: expressResponse,
            responseLog: responseLog!,
        })
    }

    /** Response para autenticação inválida no token. */
    static async NoAuthFoundInToken(props : GenericHttpResponseProps)
    {
        const { expressResponse, responseLog } = props

        await this.Send({
            responseStatus: HttpStatusEnum.UNAUTHORIZED,
            responseData: "Nenhuma autenticação válida encontrada no token.",
            expressResponse: expressResponse,
            responseLog: responseLog!,
        })
    }

    /** Response para operação proibida. */
    static async ProhibitedOperation(props : GenericHttpResponseProps)
    {
        const { expressResponse, responseLog } = props

        await this.Send({
            responseStatus: HttpStatusEnum.PROHIBITED,
            responseData: "Ação não disponível para usuário.",
            expressResponse: expressResponse,
            responseLog: responseLog!,
        })
    }

    /** Response para requisição inválida. */
    static async InvalidRequest(props : GenericHttpResponseProps)
    {
        const { expressResponse, responseLog } = props

        await this.Send({
            responseStatus: HttpStatusEnum.INVALID,
            responseData: "Corpo da requisição inválido.",
            expressResponse: expressResponse,
            responseLog: responseLog!,
        })
    }

    /** Response para usuário não encontrado. */
    static async NotFoundUser(props : GenericHttpResponseProps)
    {
        const { expressResponse, responseLog } = props

        await this.Send({
            responseStatus: HttpStatusEnum.NOT_FOUND,
            responseData: "Usuário não encontrado.",
            expressResponse: expressResponse,
            responseLog: responseLog!,
        })
    }

    /** Response para erro interno do servidor. */
    static async InternalServerError(props : DefaultResponseProps)
    {
        const { expressResponse, responseData, responseLog } = props

        await this.Send({
            responseStatus: HttpStatusEnum.INTERNAL_SERVER_ERROR,
            responseData: responseData,
            expressResponse: expressResponse,
            responseLog: responseLog!
        })
    }

    /** Response para sucesso. */
    static async Success(props : DefaultResponseProps)
    {
        const { expressResponse, responseData, responseLog, responseDataPropToCount } = props

        await this.Send({
            responseStatus: HttpStatusEnum.OK,
            responseData: responseData,
            expressResponse: expressResponse,
            responseLog: responseLog!,
            responseDataPropToCount: responseDataPropToCount
        })
    }
}

export default ResponseMessage
import { Response } from "express"

import { BadFieldsResponseProps, GenericHttpResponseProps, GlobalSendProps, ResponseMessage as ResponseMessageType } from "../../types/ResponseMessage"

import Exception from "../custom/Exception"
import Send from "./Send"

import FindValue from "../../functions/logic/FindValue"
import IsUndNull from "../../functions/logic/IsUndNull"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"

abstract class ResponseMessage
{
    /**
     * Direciona a Response para o método de tratamento final em Send.
     */
    static Send
    ({
        status,
        data,
        log,
        expressResponse,
        dataPropToCount
    } : GlobalSendProps)
    {
        data = this.FixTimeZone(data) // DESENVOLVIMENTO PROVISÓRIO PARA TRATAMENTO DE ERRO NO FUSO HORÁRIO.
        const success = this.RenderSuccess(status)
        const length = this.RenderDataLength(success, data, dataPropToCount)

        const response : ResponseMessageType = {
            success,
            data,
            length,
            log
        }

        switch (status)
        {
            case HttpStatusEnum.OK:
                return Send.OK(expressResponse, response)

            case HttpStatusEnum.ACCEPTED:
                return Send.ACCEPTED(expressResponse, response)

            case HttpStatusEnum.CREATED:
                return Send.CREATED(expressResponse, response)

            case HttpStatusEnum.INVALID:
                Send.INVALID(expressResponse, response)
                return Exception.UnexpectedError(data, log)

            case HttpStatusEnum.UNAUTHORIZED:
                Send.UNAUTHORIZED(expressResponse, response)
                return Exception.UnexpectedError(data, log)

            case HttpStatusEnum.PROHIBITED:
                Send.PROHIBITED(expressResponse, response)
                return Exception.UnexpectedError(data, log)

            case HttpStatusEnum.NOT_FOUND:
                Send.NOT_FOUND(expressResponse, response)
                return Exception.UnexpectedError(data, log)

            case HttpStatusEnum.INTERNAL_SERVER_ERROR:
                Send.INTERNAL_SERVER_ERROR(expressResponse, response)
                return Exception.UnexpectedError(data, log)

            case HttpStatusEnum.NOT_IMPLEMENTED:
                Send.NOT_IMPLEMENTED(expressResponse, response)
                return Exception.UnexpectedError(data, log)

            case HttpStatusEnum.UNAVAIALBLE:
                Send.UNAVAIALBLE(expressResponse, response)
                return Exception.UnexpectedError(data, log)

            default:
                const nullResponse : ResponseMessageType = {
                    success: false,
                    data: null,
                    length: 0,
                    log
                }
                Send.INTERNAL_SERVER_ERROR(expressResponse, nullResponse)
                return Exception.UnexpectedError(data, log)
        }
    }

    private static RenderSuccess(status : HttpStatusEnum) : boolean
    {
        switch (status)
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

    private static RenderDataLength
    (
        success : boolean,
        data : any,
        dataPropToCount? : string
    ) : number
    {
        if (!success) return 0

        try
        {
            const parsedData = IsUndNull(dataPropToCount)
                ? data
                : FindValue(data, [dataPropToCount!])

            if (parsedData instanceof Array)
                return parsedData.length

            if (parsedData instanceof Object)
                return Object.keys(parsedData).length

            return 1
        }
        catch
        {
            return 1
        }
    }

    private static BuildFieldsInfoMessage
    (
        fields : string[],
        singularMessage : string,
        pluralMessage : string
    )
    {
        let response = fields.length === 1 ? "O campo " : "Os campos "

        fields.forEach((field, i) => {
            response += `${ field }${ i === fields.length - 1 ? " " : ", " }`
        })

        response += fields.length === 1 ? singularMessage : pluralMessage + "."

        return response
    }

    static SendInvalidField
    ({
        fields,
        log,
        expressResponse
    } : BadFieldsResponseProps)
    {
        let response = this.BuildFieldsInfoMessage(fields, "está inválido", "estão inválidos")

        this.Send({
            status: HttpStatusEnum.INVALID,
            data: response,
            expressResponse: expressResponse,
            log: log,
        })

        Exception.Error(
            "Campo inválido.",
            log
        )
    }

    static SendNullField
    ({
        fields,
        log,
        expressResponse
    } : BadFieldsResponseProps)
    {
        let response = this.BuildFieldsInfoMessage(fields, "não pode ser nulo", "não podem ser nulos")

        this.Send({
            status: HttpStatusEnum.INVALID,
            data: response,
            expressResponse: expressResponse,
            log: log,
        })

        Exception.Error(
            "Campo nulo.",
            log
        )
    }

    static NotImplementedRoute
    ({
        expressResponse,
        log = "Operação não implementada."
    } : GenericHttpResponseProps)
    {
        this.Send({
            status: HttpStatusEnum.NOT_IMPLEMENTED,
            data: log,
            expressResponse: expressResponse,
            log: log,
        })

        Exception.Error(
            "Rota não implementada.",
            log
        )
    }

    static UnauthorizedUser
    ({
        expressResponse,
        log
    } : GenericHttpResponseProps)
    {
        const response = "Usuário não autenticado."

        this.Send({
            status: HttpStatusEnum.UNAUTHORIZED,
            data: response,
            expressResponse: expressResponse,
            log: log!,
        })

        Exception.Error(
            response,
            log!
        )
    }

    static UnauthorizedSystem
    ({
        expressResponse,
        log
    } : GenericHttpResponseProps)
    {
        const response = "Usuário não autenticado."

        this.Send({
            status: HttpStatusEnum.UNAUTHORIZED,
            data: response,
            expressResponse: expressResponse,
            log: log!,
        })

        Exception.Error(
            response,
            log!
        )
    }

    static NoAuthFoundInToken
    ({
        expressResponse,
        log
    } : GenericHttpResponseProps)
    {
        const response = "Nenhuma autenticação válida encontrada no token."

        this.Send({
            status: HttpStatusEnum.UNAUTHORIZED,
            data: response,
            expressResponse: expressResponse,
            log: log!,
        })

        Exception.Error(
            response,
            log!
        )
    }

    static ProhibitedOperation
    ({
        expressResponse,
        log
    } : GenericHttpResponseProps)
    {
        this.Send({
            status: HttpStatusEnum.PROHIBITED,
            data: "Ação não disponível para usuário.",
            expressResponse: expressResponse,
            log: log!,
        })

        Exception.Error(
            "Operação Proibida.",
            log!
        )
    }

    static InvalidRequest
    ({
        expressResponse,
        log
    } : GenericHttpResponseProps)
    {
        this.Send({
            status: HttpStatusEnum.INVALID,
            data: "Corpo da requisição inválido.",
            expressResponse: expressResponse,
            log: log!,
        })

        Exception.Error(
            "Request Inválida.",
            log!
        )
    }

    static NotFoundUser
    ({
        expressResponse,
        log
    } : GenericHttpResponseProps)
    {
        this.Send({
            status: HttpStatusEnum.NOT_FOUND,
            data: "Usuário não encontrado.",
            expressResponse: expressResponse,
            log: log!,
        })

        Exception.Error(
            "Usuário não encontrado.",
            log!
        )
    }

    private static FixTimeZone(data : any) // DESENVOLVIMENTO PROVISÓRIO PARA TRATAMENTO DE ERRO NO FUSO HORÁRIO.
    {
        try
        {
            if (data instanceof Array)
            {
                data.forEach(obj => {
                    if (obj instanceof Date)
                        obj.setHours(obj.getHours() - 3)
                })
            }

            if (data instanceof Date)
                data.setHours(data.getHours() - 3)

            if (typeof data === "object")
            {
                Object.entries(data).forEach(obj => {
                    if (obj[1] instanceof Date)
                        obj[1].setHours(obj[1].getHours() - 3)
                })
            }

            return data
        }
        catch
        {
            return data
        }
    }
}

export default ResponseMessage
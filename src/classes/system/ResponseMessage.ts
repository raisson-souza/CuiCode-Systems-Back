import { Response } from "express"

import Exception from "../custom/Exception"
import Send from "./Send"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"

abstract class ResponseMessage
{
    static Send
    (
        status : HttpStatusEnum,
        data: any,
        logMessage : string,
        res : Response
    )
    {
        const success = this.RenderSuccess(status)
        const length = this.RenderDataLength(data, success)

        const response = {
            "success": success,
            "data": data,
            "length": length,
            "action": logMessage
        }

        switch (status)
        {
            case HttpStatusEnum.OK:
                return Send.OK(res, response, logMessage)

            case HttpStatusEnum.ACCEPTED:
                return Send.ACCEPTED(res, response, logMessage)

            case HttpStatusEnum.CREATED:
                return Send.CREATED(res, response, logMessage)

            case HttpStatusEnum.INVALID:
                Send.INVALID(res, response, logMessage)
                return Exception.UnexpectedError(data, logMessage)

            case HttpStatusEnum.UNAUTHORIZED:
                Send.UNAUTHORIZED(res, response, logMessage)
                return Exception.UnexpectedError(data, logMessage)

            case HttpStatusEnum.PROHIBITED:
                Send.PROHIBITED(res, response, logMessage)
                return Exception.UnexpectedError(data, logMessage)

            case HttpStatusEnum.NOT_FOUND:
                Send.NOT_FOUND(res, response, logMessage)
                return Exception.UnexpectedError(data, logMessage)

            case HttpStatusEnum.INTERNAL_SERVER_ERROR:
                Send.INTERNAL_SERVER_ERROR(res, response, logMessage)
                return Exception.UnexpectedError(data, logMessage)

            case HttpStatusEnum.NOT_IMPLEMENTED:
                Send.NOT_IMPLEMENTED(res, response, logMessage)
                return Exception.UnexpectedError(data, logMessage)

            case HttpStatusEnum.UNAVAIALBLE:
                Send.UNAVAIALBLE(res, response, logMessage)
                return Exception.UnexpectedError(data, logMessage)

            default:
                Send.INTERNAL_SERVER_ERROR(res, null, logMessage)
                return Exception.UnexpectedError(data, logMessage)
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
                return false
            default:
                return false
        }
    }

    private static RenderDataLength
    (
        data : any,
        success : boolean
    ) : number
    {
        if (!success) return 0

        if (data instanceof Array)
            return data.length

        if (data instanceof Object)
            return Object.keys(data).length

        return 1
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
    (
        fields : string[],
        logMessage : string,
        res : Response
    )
    {
        let response = this.BuildFieldsInfoMessage(fields, "está inválido", "estão inválidos")

        this.Send(
            HttpStatusEnum.INVALID,
            response,
            logMessage,
            res
        )

        Exception.Error(
            "Campo inválido.",
            logMessage
        )
    }

    static SendNullField
    (
        fields : string[],
        logMessage : string,
        res : Response
    )
    {
        let response = this.BuildFieldsInfoMessage(fields, "não pode ser nulo", "não podem ser nulos")

        this.Send(
            HttpStatusEnum.INVALID,
            response,
            logMessage,
            res
        )

        Exception.Error(
            "Campo nulo.",
            logMessage
        )
    }

    static NotImplementedRoute
    (
        res : Response
    )
    {
        const log = "Operação não implementada."
        this.Send(
            HttpStatusEnum.NOT_IMPLEMENTED,
            log,
            log,
            res
        )

        Exception.Error(
            "Rota não implementada.",
            log
        )
    }

    static UnauthorizedUser
    (
        res : Response,
        logMessage : string
    )
    {
        this.Send(
            HttpStatusEnum.UNAUTHORIZED,
            "Usuário não autenticado.",
            logMessage,
            res
        )

        Exception.Error(
            "Usuário não-autorizado.",
            logMessage
        )
    }

    static ProhibitedOperation
    (
        res : Response,
        logMessage : string
    )
    {
        this.Send(
            HttpStatusEnum.PROHIBITED,
            "Ação não disponível para usuário.",
            logMessage,
            res
        )

        Exception.Error(
            "Operação proibida.",
            logMessage
        )
    }

    static InvalidRequest
    (
        res : Response,
        logMessage : string
    )
    {
        this.Send(
            HttpStatusEnum.INVALID,
            "Corpo da requisição inválido.",
            logMessage,
            res
        )

        Exception.Error(
            "Request inválida.",
            logMessage
        )
    }

    static NotFoundUser
    (
        res : Response,
        logMessage : string
    )
    {
        this.Send(
            HttpStatusEnum.NOT_FOUND,
            "Usuário não encontrado.",
            logMessage,
            res
        )

        Exception.Error(
            "Usuário não encontrado.",
            logMessage
        )
    }
}

export default ResponseMessage
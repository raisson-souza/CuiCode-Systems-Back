import { Response } from "express"

import { PrimalSendProps, ResponseMessage } from "../../types/ResponseMessage"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"

abstract class Send
{
    /**
     * Realiza o envio final da Response.
     */
    private static Send
    ({
        expressResponse,
        response,
        status
    } : PrimalSendProps)
    {
        if (!expressResponse.headersSent)
        {
            expressResponse.status(status).send(response)
            console.log(`${ new Date().toString() } | STATUS ${ status } | ${ response.log }`)
        }
    }

    static OK(expressRes: Response, response: ResponseMessage)
    {
        Send.Send({
            expressResponse: expressRes,
            response: response,
            status: HttpStatusEnum.OK
        })
    }

    static CREATED(expressRes: Response, response: ResponseMessage)
    {
        Send.Send({
            expressResponse: expressRes,
            response: response,
            status: HttpStatusEnum.CREATED
        })
    }

    static ACCEPTED(expressRes: Response, response: ResponseMessage)
    {
        Send.Send({
            expressResponse: expressRes,
            response: response,
            status: HttpStatusEnum.ACCEPTED
        })
    }

    static INVALID(expressRes: Response, response: ResponseMessage)
    {
        Send.Send({
            expressResponse: expressRes,
            response: response,
            status: HttpStatusEnum.INVALID
        })
    }

    static UNAUTHORIZED(expressRes: Response, response: ResponseMessage)
    {
        Send.Send({
            expressResponse: expressRes,
            response: response,
            status: HttpStatusEnum.UNAUTHORIZED
        })
    }

    static PROHIBITED(expressRes: Response, response: ResponseMessage)
    {
        Send.Send({
            expressResponse: expressRes,
            response: response,
            status: HttpStatusEnum.PROHIBITED
        })
    }

    static NOT_FOUND(expressRes: Response, response: ResponseMessage)
    {
        Send.Send({
            expressResponse: expressRes,
            response: response,
            status: HttpStatusEnum.NOT_FOUND
        })
    }

    static INTERNAL_SERVER_ERROR(expressRes: Response, response: ResponseMessage)
    {
        Send.Send({
            expressResponse: expressRes,
            response: response,
            status: HttpStatusEnum.INTERNAL_SERVER_ERROR
        })
    }

    static NOT_IMPLEMENTED(expressRes: Response, response: ResponseMessage)
    {
        Send.Send({
            expressResponse: expressRes,
            response: response,
            status: HttpStatusEnum.NOT_IMPLEMENTED
        })
    }

    static UNAVAIALBLE(expressRes: Response, response: ResponseMessage)
    {
        Send.Send({
            expressResponse: expressRes,
            response: response,
            status: HttpStatusEnum.UNAVAIALBLE
        })
    }
}

export default Send
import { Response } from "express"

import HttpStatusEnum from "../../enums/system/HttpStatusEnum"

abstract class Send
{
    private static Send
    (
        res : Response,
        responseMessage : any,
        logMessage : string,
        status : HttpStatusEnum
    )
    {
        if (!res.headersSent)
            res.status(status).send(responseMessage)

        console.log(`| STATUS ${ status } | ${ logMessage }`)
    }

    static OK(res: Response, responseMessage: any, logMessage: string)
    {
        Send.Send(res, responseMessage, logMessage, HttpStatusEnum.OK)
    }

    static CREATED(res: Response, responseMessage: any, logMessage: string)
    {
        Send.Send(res, responseMessage, logMessage, HttpStatusEnum.CREATED)
    }

    static ACCEPTED(res: Response, responseMessage: any, logMessage: string)
    {
        Send.Send(res, responseMessage, logMessage, HttpStatusEnum.ACCEPTED)
    }

    static INVALID(res: Response, responseMessage: any, logMessage: string)
    {
        Send.Send(res, responseMessage, logMessage, HttpStatusEnum.INVALID)
    }

    static UNAUTHORIZED(res: Response, responseMessage: any, logMessage: string)
    {
        Send.Send(res, responseMessage, logMessage, HttpStatusEnum.UNAUTHORIZED)
    }

    static PROHIBITED(res: Response, responseMessage: any, logMessage: string)
    {
        Send.Send(res, responseMessage, logMessage, HttpStatusEnum.PROHIBITED)
    }

    static NOT_FOUND(res: Response, responseMessage: any, logMessage: string)
    {
        Send.Send(res, responseMessage, logMessage, HttpStatusEnum.NOT_FOUND)
    }

    static INTERNAL_SERVER_ERROR(res: Response, responseMessage: any, logMessage: string)
    {
        Send.Send(res, responseMessage, logMessage, HttpStatusEnum.INTERNAL_SERVER_ERROR)
    }

    static NOT_IMPLEMENTED(res: Response, responseMessage: any, logMessage: string)
    {
        Send.Send(res, responseMessage, logMessage, HttpStatusEnum.NOT_IMPLEMENTED)
    }

    static UNAVAIALBLE(res: Response, responseMessage: any, logMessage: string)
    {
        Send.Send(res, responseMessage, logMessage, HttpStatusEnum.UNAVAIALBLE)
    }
}

export default Send
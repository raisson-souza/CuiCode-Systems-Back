import {
    Response,
    logger
} from "firebase-functions"

import HttpStatus from "../enums/HttpStatus"

import GetDate from "./LocalTime"

type sendFunction = (
    res: Response,
    responseMessage: any,
    logMessage: string
) => void

type SendFunctions = {
    Ok :          sendFunction,
    Created:      sendFunction,
    Error:        sendFunction,
    NotFound:     sendFunction,
    Invalid:      sendFunction,
    Unauthorized: sendFunction,
}

const Send : SendFunctions = {
    Ok: Ok,
    Created: Created,
    Error: Error,
    NotFound: NotFound,
    Invalid: Invalid,
    Unauthorized: Unauthorized,
}

function Ok(res: Response, responseMessage: any, logMessage: string) : void
{
    logger.info(`Ação (OK): ${ logMessage } realizada com sucesso em ${ GetDate() }`)
    res.status(HttpStatus.OK).send(responseMessage)
}

function Created(res: Response, responseMessage: any, logMessage: string) : void
{
    logger.info(`Ação (CREATED): ${ logMessage } realizada com sucesso em ${ GetDate() }`)
    res.status(HttpStatus.CREATED).send(responseMessage)
}

function Error(res: Response, responseMessage: any, logMessage: string) : void
{
    logger.error(`Ação (ERROR): ${ logMessage } resultou em erro em ${ GetDate() }`)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(responseMessage)
}

function NotFound(res: Response, responseMessage: any, logMessage: string) : void
{
    logger.warn(`Ação (NOT FOUND): ${ logMessage } resultou em erro em ${ GetDate() }`)
    res.status(HttpStatus.NOT_FOUND).send(responseMessage)
}

function Invalid(res: Response, responseMessage: any, logMessage: string) : void
{
    logger.error(`Ação (INVALID): ${ logMessage } resultou em erro em ${ GetDate() }`)
    res.status(HttpStatus.INVALID).send(responseMessage)
}

function Unauthorized(res: Response, responseMessage: any, logMessage: string) : void
{
    logger.warn(`Ação (UNAUTHORIZED): ${ logMessage } resultou em erro em ${ GetDate() }`)
    res.status(HttpStatus.UNAUTHORIZED).send(responseMessage)
}

export default Send

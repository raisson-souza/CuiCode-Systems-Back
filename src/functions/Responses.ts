import { Request, Response } from "express"

import HttpStatus from "../enums/HttpStatusEnum"

type sendFunction = (
    res: Response,
    responseMessage: any,
    logMessage: string
) => void

type SendFunctions = {
    Ok :              sendFunction,
    Created:          sendFunction,
    Error:            sendFunction,
    NotFound:         sendFunction,
    Invalid:          sendFunction,
    Unauthorized:     sendFunction,
    MethodNotAllowed: sendFunction,
}

/**
 * res => Response
 * responseMessage => Resposta ao cliente
 * logMessage => Ação realizada para registro no log
 */
const Send : SendFunctions = {
    Ok: Ok,
    Created: Created,
    Error: Error,
    NotFound: NotFound,
    Invalid: Invalid,
    Unauthorized: Unauthorized,
    MethodNotAllowed: MethodNotAllowed,
}

function Ok(res: Response, responseMessage: any, logMessage: string) : void
{
    res.status(HttpStatus.OK).send(responseMessage)
}

function Created(res: Response, responseMessage: any, logMessage: string) : void
{
    res.status(HttpStatus.CREATED).send(responseMessage)
}

function Error(res: Response, responseMessage: any, logMessage: string) : void
{
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(responseMessage)
}

function NotFound(res: Response, responseMessage: any, logMessage: string) : void
{
    res.status(HttpStatus.NOT_FOUND).send(responseMessage)
}

function Invalid(res: Response, responseMessage: any, logMessage: string) : void
{
    res.status(HttpStatus.INVALID).send(responseMessage)
}

function Unauthorized(res: Response, responseMessage: any, logMessage: string) : void
{
    res.status(HttpStatus.UNAUTHORIZED).send(responseMessage)
}

function MethodNotAllowed(res: Response, responseMessage: any, logMessage: string) : void
{
    res.status(HttpStatus.METHOD_NOT_ALLOWED).send(responseMessage)
}

export default Send

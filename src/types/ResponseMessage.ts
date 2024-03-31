import { Response  } from "express"
import HttpStatusEnum from "../enums/system/HttpStatusEnum"

type ResponseMessage = {
    success : boolean
    data : any
    length : number
    log : string
}

type GenericHttpResponseProps = {
    expressResponse : Response
    log? : string
}

type BadFieldsResponseProps = {
    fields : string[]
    log : string
    expressResponse : Response
}

type GlobalSendProps = {
    status : HttpStatusEnum
    data : any
    log : string
    expressResponse : Response
    dataPropToCount? : string
}

type PrimalSendProps = {
    expressResponse : Response
    response : ResponseMessage
    status : HttpStatusEnum
}

export type {
    ResponseMessage,
    GenericHttpResponseProps,
    BadFieldsResponseProps,
    GlobalSendProps,
    PrimalSendProps
}
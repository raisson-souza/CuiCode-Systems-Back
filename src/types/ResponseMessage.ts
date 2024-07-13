import { Response  } from "express"
import HttpStatusEnum from "../enums/system/HttpStatusEnum"

type SendProps = {
    responseStatus : HttpStatusEnum
    responseData : any
    responseLog : string
    expressResponse : Response
    responseDataPropToCount? : string
}

type FixTimeZoneProps = {
    responseData : any
}

type RenderSuccessProps = {
    responseStatus : HttpStatusEnum
}

type RenderDataLengthProps = {
    responseSuccess : boolean
    responseData : any
    /** Chave da data para ser contada. */
    responseDataPropToCount? : string
}

type BuildFieldsInfoMessageProps = {
    fieldsNames : string[]
    singularMessage : string
    pluralMessage : string
}

type GenericHttpResponseProps = {
    expressResponse : Response
    responseLog? : string
}

type BadFieldsResponseProps = {
    fields : string[]
    responseLog : string
    expressResponse : Response
}

type DefaultResponseProps = {
    responseData : any
    responseDataPropToCount? : string
} & GenericHttpResponseProps

/** Response final. */
type FinalResponseMessage = {
    success : boolean
    data : any
    length : number
    responseLog : string
}

export type {
    BadFieldsResponseProps,
    BuildFieldsInfoMessageProps,
    DefaultResponseProps,
    FinalResponseMessage,
    FixTimeZoneProps,
    GenericHttpResponseProps,
    RenderDataLengthProps,
    RenderSuccessProps,
    SendProps,
}
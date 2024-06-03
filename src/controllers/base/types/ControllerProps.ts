import { Express } from "express"
import { Multer } from "multer"

type ControllerProps = {
    app : Express,
    upload : Multer,
}

export type { ControllerProps }
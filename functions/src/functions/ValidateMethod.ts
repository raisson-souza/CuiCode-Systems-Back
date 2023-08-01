import { Request, Response } from "firebase-functions"
import HttpStatus from "../enums/HttpStatus"

export default function ValidateMethod
(
    res : Response,
    req : Request,
    methods : Array<string>
)
: void
{
    if (!methods.includes(req.method))
        res.status(HttpStatus.METHOD_NOT_ALLOWED).send("Method Not Allowed")
}
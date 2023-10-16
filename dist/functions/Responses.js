"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatusEnum_1 = __importDefault(require("../enums/HttpStatusEnum"));
/**
 * res => Response
 * responseMessage => Resposta ao cliente
 * logMessage => Ação realizada para registro no log
 */
const Send = {
    Ok: Ok,
    Created: Created,
    Error: Error,
    NotFound: NotFound,
    Invalid: Invalid,
    Unauthorized: Unauthorized,
    MethodNotAllowed: MethodNotAllowed,
};
function Ok(res, responseMessage, logMessage) {
    res.status(HttpStatusEnum_1.default.OK).send(responseMessage);
}
function Created(res, responseMessage, logMessage) {
    res.status(HttpStatusEnum_1.default.CREATED).send(responseMessage);
}
function Error(res, responseMessage, logMessage) {
    res.status(HttpStatusEnum_1.default.INTERNAL_SERVER_ERROR).send(responseMessage);
}
function NotFound(res, responseMessage, logMessage) {
    res.status(HttpStatusEnum_1.default.NOT_FOUND).send(responseMessage);
}
function Invalid(res, responseMessage, logMessage) {
    res.status(HttpStatusEnum_1.default.INVALID).send(responseMessage);
}
function Unauthorized(res, responseMessage, logMessage) {
    res.status(HttpStatusEnum_1.default.UNAUTHORIZED).send(responseMessage);
}
function MethodNotAllowed(res, responseMessage, logMessage) {
    res.status(HttpStatusEnum_1.default.METHOD_NOT_ALLOWED).send(responseMessage);
}
exports.default = Send;
//# sourceMappingURL=Responses.js.map
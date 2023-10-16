"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpStatusEnum;
(function (HttpStatusEnum) {
    HttpStatusEnum[HttpStatusEnum["OK"] = 200] = "OK";
    HttpStatusEnum[HttpStatusEnum["CREATED"] = 201] = "CREATED";
    HttpStatusEnum[HttpStatusEnum["INVALID"] = 400] = "INVALID";
    HttpStatusEnum[HttpStatusEnum["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatusEnum[HttpStatusEnum["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatusEnum[HttpStatusEnum["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    HttpStatusEnum[HttpStatusEnum["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(HttpStatusEnum || (HttpStatusEnum = {}));
exports.default = HttpStatusEnum;
//# sourceMappingURL=HttpStatusEnum.js.map
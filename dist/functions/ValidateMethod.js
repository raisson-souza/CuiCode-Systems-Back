"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Responses_1 = __importDefault(require("./Responses"));
/**
 * Validates a enpoint request methods.
 * Returns true if successful, false otherwise.
 * @param res Response
 * @param req Request
 * @param methods Methods expected
 */
function ValidateMethod(res, req, methods) {
    if (!methods.includes(req.method)) {
        Responses_1.default.MethodNotAllowed(res, "Método não autorizado.", "Validação de Método");
        return false;
    }
    return true;
}
exports.default = ValidateMethod;
//# sourceMappingURL=ValidateMethod.js.map
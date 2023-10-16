"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmailSender_1 = __importDefault(require("../system/EmailSender"));
const EmailTitlesEnum_1 = __importDefault(require("../../enums/EmailTitlesEnum"));
/**
 * Validates SQL injection risk in a query parameter.
 */
function SqlInjectionVerifier(param) {
    if (param.toUpperCase().includes("OR")) {
        new EmailSender_1.default().Internal(EmailTitlesEnum_1.default.SYSTEM_RISK, `Risco de SQL injection detectado, SQL: ${param}`);
        throw new Error("Injeção de SQL verificada, operação interrompida.");
    }
}
exports.default = SqlInjectionVerifier;
//# sourceMappingURL=SqlInjectionVerifier.js.map
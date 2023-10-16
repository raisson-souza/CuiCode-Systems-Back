"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Gets local time.
 */
function GetDate() {
    const date = new Date();
    return date.toLocaleString('pt-BR', { timeZone: "America/Sao_Paulo" });
}
exports.default = GetDate;
//# sourceMappingURL=GetDate.js.map
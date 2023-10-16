"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Validates if a param is undefined or null
 */
function IsUndNull(param) {
    if (param == undefined || param == null)
        return true;
    if (typeof param == "string") {
        if (param.trim() == "" || param == "null" || param == "undefined")
            return true;
    }
    return false;
}
exports.default = IsUndNull;
//# sourceMappingURL=IsUndNull.js.map
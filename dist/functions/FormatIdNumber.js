"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Formats a number to client-friendly.
 */
function FormatIdNumber(id) {
    const stringId = id.toString();
    switch (stringId.length) {
        case 1:
            return `00${stringId}`;
        case 2:
            return `0${stringId}`;
        case 3:
            return stringId;
        default:
            return stringId;
    }
}
exports.default = FormatIdNumber;
//# sourceMappingURL=FormatIdNumber.js.map
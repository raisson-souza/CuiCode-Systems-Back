"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Converts a Date to SQL timestamp format.
 */
function ToSqlTimestamp(date) {
    const newDate = new Date(date).getTime() / 1000;
    return `to_timestamp('${newDate}')`;
}
exports.default = ToSqlTimestamp;
//# sourceMappingURL=ToSqlTimestamp.js.map
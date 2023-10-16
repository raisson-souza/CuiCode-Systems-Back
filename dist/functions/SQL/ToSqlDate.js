"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Converts a Date to a acceptable SQL date format.
 */
function ToSqlDate(date) {
    const newDate = new Date(date).toLocaleDateString();
    return `to_date('${newDate}', 'dd MM yyyy')`;
}
exports.default = ToSqlDate;
//# sourceMappingURL=ToSqlDate.js.map
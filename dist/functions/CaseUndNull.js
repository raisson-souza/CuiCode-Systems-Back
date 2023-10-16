"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IsUndNull_1 = __importDefault(require("./IsUndNull"));
/**
 * Checks if the first argument is null or undefined.
 * If true, returns the second argument,
 * If false, returns the first argument
 */
function CaseUndNull(param1, param2) {
    return (0, IsUndNull_1.default)(param1)
        ? param2
        : param1;
}
exports.default = CaseUndNull;
//# sourceMappingURL=CaseUndNull.js.map
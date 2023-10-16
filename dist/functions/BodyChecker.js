"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Checks all params of a body for a process.
 */
function BodyChecker(body, params) {
    let c = 0;
    Object.keys(body).forEach(param => {
        if (params.includes(param))
            c++;
    });
    if (c < params.length)
        throw new Error('O objeto não contém todos os parâmetros.');
}
exports.default = BodyChecker;
//# sourceMappingURL=BodyChecker.js.map
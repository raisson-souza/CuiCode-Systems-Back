"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IsUndNull_1 = __importDefault(require("../IsUndNull"));
const CORS_CONFIG_json_1 = __importDefault(require("../../config/CORS_CONFIG.json"));
async function ValidateCorsAsync(req, res) {
    const { allowed_origins, api_test_token } = CORS_CONFIG_json_1.default;
    const cors = require("cors")({ origin: allowed_origins });
    if ((req.header("Origin") ||
        (0, IsUndNull_1.default)(req.header("Origin"))) &&
        !allowed_origins.includes(req.header("Origin")))
        if (req.header("authorization") != api_test_token)
            throw new Error();
    cors(req, res, () => {
        res.set("Access-Control-Allow-Origin", req.get("Origin"));
    });
}
exports.default = ValidateCorsAsync;
//# sourceMappingURL=ValidateCorsAsync.js.map
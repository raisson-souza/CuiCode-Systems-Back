"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const FeaturesController_1 = __importDefault(require("./controllers/FeaturesController"));
const DatabaseStageEnum_1 = require("./enums/DatabaseStageEnum");
const CORS_CONFIG_json_1 = __importDefault(require("./config/CORS_CONFIG.json"));
const environment_config_json_1 = __importDefault(require("./config/environment_config.json"));
const UserController_1 = __importDefault(require("./controllers/UserController"));
const DATABASE = (0, DatabaseStageEnum_1.ConvertNumberToDatabaseStageEnum)(environment_config_json_1.default.environment);
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
(0, cors_1.default)({ origin: CORS_CONFIG_json_1.default.allowed_origins });
app.get('/teste', (req, res) => {
    res.send("Hello");
});
(0, FeaturesController_1.default)(app, DATABASE);
(0, UserController_1.default)(app, DATABASE);
app.listen(3000, () => {
    console.log("Servidor iniciado na porta 3000");
});
//# sourceMappingURL=index.js.map
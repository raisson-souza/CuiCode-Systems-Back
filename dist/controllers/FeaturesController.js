"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TraceAccessService_1 = __importDefault(require("../services/features/TraceAccessService"));
const ValidateCorsAsync_1 = __importDefault(require("../functions/system/ValidateCorsAsync"));
const Responses_1 = __importDefault(require("../functions/Responses"));
function FeaturesController(app, database) {
    app.trace('/TraceAccess', (req, res) => {
        // const service = new Service(req, res, database)
        Promise.resolve((0, ValidateCorsAsync_1.default)(req, res))
            .then(() => { (0, TraceAccessService_1.default)(req, res); })
            .catch(() => { Responses_1.default.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API"); });
    });
}
exports.default = FeaturesController;
//# sourceMappingURL=FeaturesController.js.map
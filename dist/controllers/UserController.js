"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Service_1 = __importDefault(require("../classes/Service"));
const Responses_1 = __importDefault(require("../functions/Responses"));
const ValidateCorsAsync_1 = __importDefault(require("../functions/system/ValidateCorsAsync"));
// USER
const CreateUserService_1 = __importDefault(require("../services/user/CRUD/CreateUserService"));
const GetUserService_1 = __importDefault(require("../services/user/CRUD/GetUserService"));
const ListUsersService_1 = __importDefault(require("../services/user/CRUD/ListUsersService"));
const UpdateUserService_1 = __importDefault(require("../services/user/CRUD/UpdateUserService"));
// EMAIL
const ApproveUserEmailService_1 = __importDefault(require("../services/user/services/email/ApproveUserEmailService"));
const SendManualEmailApprovalService_1 = __importDefault(require("../services/user/services/email/SendManualEmailApprovalService"));
function UsersController(app, database) {
    app.get('/GetUser', (req, res) => {
        const service = new Service_1.default(req, res, database);
        Promise.resolve((0, ValidateCorsAsync_1.default)(req, res))
            .then(() => { (0, GetUserService_1.default)(service); })
            .catch(() => { Responses_1.default.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API"); });
    });
    app.get('/ListUsers', (req, res) => {
        const service = new Service_1.default(req, res, database);
        Promise.resolve((0, ValidateCorsAsync_1.default)(req, res))
            .then(() => { (0, ListUsersService_1.default)(service); })
            .catch(() => { Responses_1.default.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API"); });
    });
    app.post('/CreateUser', (req, res) => {
        const service = new Service_1.default(req, res, database);
        Promise.resolve((0, ValidateCorsAsync_1.default)(req, res))
            .then(() => { (0, CreateUserService_1.default)(service); })
            .catch(() => { Responses_1.default.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API"); });
    });
    app.put('/UpdateUser', (req, res) => {
        const service = new Service_1.default(req, res, database);
        Promise.resolve((0, ValidateCorsAsync_1.default)(req, res))
            .then(() => { (0, UpdateUserService_1.default)(service); })
            .catch(() => { Responses_1.default.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API"); });
    });
    app.post('/ApproveUserEmail', (req, res) => {
        const service = new Service_1.default(req, res, database);
        // enviar link do ERP para acessar
        // CORS não é necessário pois o acesso é externo
        (0, ApproveUserEmailService_1.default)(service);
    });
    app.post('SendManualEmailApproval', (req, res) => {
        const service = new Service_1.default(req, res, database);
        Promise.resolve((0, ValidateCorsAsync_1.default)(req, res))
            .then(() => { (0, SendManualEmailApprovalService_1.default)(service); })
            .catch(() => { Responses_1.default.Error(res, "Acesso a CuiCodeSystems negado.", "Acesso a API"); });
    });
}
exports.default = UsersController;
//# sourceMappingURL=UserController.js.map
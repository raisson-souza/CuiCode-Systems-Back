"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../../classes/User"));
const SendApprovalUserEmailOperation_1 = __importDefault(require("../services/email/SendApprovalUserEmailOperation"));
const CreateUser_1 = __importDefault(require("../utilities/CreateUser"));
const ValidateUser_1 = __importDefault(require("../utilities/ValidateUser"));
const Responses_1 = __importDefault(require("../../../functions/Responses"));
const EmailSender_1 = __importDefault(require("../../../functions/system/EmailSender"));
const EmailTitlesEnum_1 = __importDefault(require("../../../enums/EmailTitlesEnum"));
/**
 * Creates a user.
 */
async function CreateUserService(service) {
    const action = "Criação de usuário";
    try {
        const { REQ, RES, DB_connection, DB_stage, } = service;
        if (REQ.method != "POST")
            return Responses_1.default.MethodNotAllowed(RES, "Método não autorizado.", action);
        const user = CheckBody(REQ.body);
        await Promise.resolve((0, ValidateUser_1.default)(DB_connection, DB_stage, user, true))
            .then(async () => {
            await Promise.resolve((0, CreateUser_1.default)(DB_connection, DB_stage, user))
                .then(async () => {
                Responses_1.default.Ok(RES, `Usuário ${user.GenerateUserKey()} criado com sucesso.`, action);
                new EmailSender_1.default().Internal(EmailTitlesEnum_1.default.NEW_USER, user.GenerateUserKey());
                await (0, SendApprovalUserEmailOperation_1.default)(user, DB_stage, DB_connection, true);
            })
                .catch(ex => {
                Responses_1.default.Error(RES, `Houve um erro ao criar o usuário. Erro: ${ex.message}`, action);
            });
        })
            .catch(ex => {
            Responses_1.default.Error(RES, `Houve um erro ao criar o usuário. Erro: ${ex.message}`, action);
        });
    }
    catch (ex) {
        Responses_1.default.Error(service.RES, `Houve um erro ao criar o usuário. Erro: ${ex.message}`, action);
    }
    finally {
        service.DB_connection.end();
    }
}
exports.default = CreateUserService;
// A criação de usuário não necessita de um usuário requeridor.
function CheckBody(body) {
    return new User_1.default(body, false, true);
}
//# sourceMappingURL=CreateUserService.js.map
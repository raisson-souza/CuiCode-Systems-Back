"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../../classes/User"));
const SendApprovalUserEmailOperation_1 = __importDefault(require("../services/email/SendApprovalUserEmailOperation"));
const ValidateUser_1 = __importDefault(require("../utilities/ValidateUser"));
const UpdateUser_1 = __importDefault(require("../utilities/UpdateUser"));
const Responses_1 = __importDefault(require("../../../functions/Responses"));
const IsUndNull_1 = __importDefault(require("../../../functions/IsUndNull"));
/**
 * Updates a user.
 * @param req User object
 * @param res
 * @param db
 * @param admin
 */
async function UpdateUserService(service) {
    const action = "Edição de usuário";
    try {
        const { REQ, RES, DB_connection, DB_stage } = service;
        if (REQ.method != "PUT")
            return Responses_1.default.MethodNotAllowed(RES, "Método não autorizado.", action);
        const user = CheckBody(REQ.body);
        await (0, ValidateUser_1.default)(DB_connection, DB_stage, user, false);
        await Promise.resolve((0, UpdateUser_1.default)(DB_connection, DB_stage, user))
            .then(() => {
            Responses_1.default.Ok(RES, `Usuário editado com sucesso.`, action);
        })
            .catch(ex => {
            throw new Error(ex.message);
        });
        if (!(0, IsUndNull_1.default)(user.EmailAproved) && !user.EmailAproved)
            await (0, SendApprovalUserEmailOperation_1.default)(user, DB_stage, DB_connection);
    }
    catch (ex) {
        Responses_1.default.Error(service.RES, `Houve um erro ao editar o usuário. Erro: ${ex.message}`, action);
    }
    finally {
        service.DB_connection.end();
    }
}
exports.default = UpdateUserService;
function CheckBody(body) {
    if ((0, IsUndNull_1.default)(body))
        throw new Error("Corpo da requisição inválido.");
    const user = new User_1.default(body, false, false, true);
    if ((0, IsUndNull_1.default)(user.Id))
        throw new Error("Id de usuário a ser atualizado não encontrado.");
    return user;
}
//# sourceMappingURL=UpdateUserService.js.map
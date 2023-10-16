"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const QueryUser_1 = __importDefault(require("../utilities/QueryUser"));
const IsUndNull_1 = __importDefault(require("../../../functions/IsUndNull"));
const Responses_1 = __importDefault(require("../../../functions/Responses"));
/**
 * Queries a user.
 */
async function GetUserService(service) {
    const action = "Consulta de usuário.";
    try {
        const { REQ, RES, DB_connection, DB_stage } = service;
        if (REQ.method != "GET")
            return Responses_1.default.MethodNotAllowed(RES, "Método não autorizado.", action);
        const userId = CheckQuery(REQ.query);
        await Promise.resolve((0, QueryUser_1.default)(DB_connection, DB_stage, userId))
            .then(user => {
            Responses_1.default.Ok(RES, user, action);
        })
            .catch(ex => {
            Responses_1.default.Error(RES, `Houve um erro ao consultar o usuário. Erro: ${ex.message}`, action);
        });
    }
    catch (ex) {
        Responses_1.default.Error(service.RES, `Houve um erro ao consultar o usuário. Erro: ${ex.message}`, action);
    }
    finally {
        service.DB_connection.end();
    }
}
exports.default = GetUserService;
function CheckQuery(query) {
    if ((0, IsUndNull_1.default)(query.UserId))
        throw new Error("Id de usuário não encontrado na URL.");
    if (query.UserId < 0)
        throw new Error("Id de usuário inválido.");
    return Number.parseInt(query.UserId);
}
//# sourceMappingURL=GetUserService.js.map
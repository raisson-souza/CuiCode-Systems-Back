"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IsUndNull_1 = __importDefault(require("../../../functions/IsUndNull"));
const Responses_1 = __importDefault(require("../../../functions/Responses"));
const QueryUsersInfo_1 = __importDefault(require("../utilities/QueryUsersInfo"));
/**
 * Queries specific information about all users.
 * @param req requiredInfo = {Part of User object}
 * @param res
 * @param db
 */
async function ListUsersService(service) {
    const action = "Listagem de usuários.";
    try {
        const { REQ, RES, DB_connection, DB_stage } = service;
        if (REQ.method != "GET")
            return Responses_1.default.MethodNotAllowed(RES, "Método não autorizado.", action);
        // O FRONT-END DEVE ENVIAR AS INFORMAÇÕES JÁ CONVERTIDAS PARA OS MESMOS CAMPOS DO BANCO
        const userRequiredInfo = CheckQuery(REQ.query);
        await Promise.resolve((0, QueryUsersInfo_1.default)(DB_connection, DB_stage, userRequiredInfo))
            .then(userInfos => {
            Responses_1.default.Ok(RES, userInfos, action);
        })
            .catch(ex => {
            Responses_1.default.Error(RES, `Houve um erro ao listar as informações requeridas dos usuários. Erro: ${ex.message}`, action);
        });
    }
    catch (ex) {
        Responses_1.default.Error(service.RES, `Houve um erro ao listar as informações requeridas dos usuários. Erro: ${ex.message}`, action);
    }
    finally {
        service.DB_connection.end();
    }
}
exports.default = ListUsersService;
function CheckQuery(query) {
    if ((0, IsUndNull_1.default)(query.RequiredInfo))
        throw new Error("Informações requeridas dos usuários não encontradas na URL.");
    const JsonConvertedQuery = JSON.parse(query.RequiredInfo);
    const RequiredInfoArray = new Array(JsonConvertedQuery);
    return RequiredInfoArray[0];
}
//# sourceMappingURL=ListUsersService.js.map
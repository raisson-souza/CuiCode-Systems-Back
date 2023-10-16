"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Responses_1 = __importDefault(require("../../../../functions/Responses"));
const SendApprovalUserEmailOperation_1 = __importDefault(require("./SendApprovalUserEmailOperation"));
async function SendManualEmailApprovalService(service) {
    const action = "Envio manual de aprovação de email de usuário";
    try {
        const { REQ, RES, DB_connection, DB_stage, } = service;
        if (REQ.method != "POST")
            return Responses_1.default.MethodNotAllowed(RES, "Método não autorizado.", action);
        await service.SetReqUserAsync();
        // O email a ser aprovado já está no UserReq
        await Promise.resolve((0, SendApprovalUserEmailOperation_1.default)(service.USER_req, DB_stage, DB_connection))
            .then(() => {
            Responses_1.default.Ok(RES, "Solicitação de aprovação de email realizada com sucesso.", action);
        })
            .catch(ex => {
            throw new Error(ex.message);
        });
    }
    catch (ex) {
        Responses_1.default.Error(service.RES, `Houve um erro ao realizar a solicitação de aprovação de email. Erro: ${ex.message}`, action);
    }
    finally {
        service.DB_connection.end();
    }
}
exports.default = SendManualEmailApprovalService;
//# sourceMappingURL=SendManualEmailApprovalService.js.map
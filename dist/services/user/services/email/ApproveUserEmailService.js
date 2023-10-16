"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmailApproval_1 = require("../../../../classes/EmailApproval");
const IsUndNull_1 = __importDefault(require("../../../../functions/IsUndNull"));
const Responses_1 = __importDefault(require("../../../../functions/Responses"));
const SqlInjectionVerifier_1 = __importDefault(require("../../../../functions/SQL/SqlInjectionVerifier"));
const EmailSender_1 = __importDefault(require("../../../../functions/system/EmailSender"));
const EmailTitlesEnum_1 = __importDefault(require("../../../../enums/EmailTitlesEnum"));
async function ApproveUserEmailService(service) {
    var _a;
    const action = "Aprovação de email de usuário";
    try {
        const { REQ, RES, DB_connection, DB_stage, } = service;
        if (REQ.method != "GET")
            return Responses_1.default.MethodNotAllowed(RES, "Método não autorizado.", action);
        await service.SetReqUserAsync();
        const toApproveEmail = CheckQuery(REQ.query);
        (0, SqlInjectionVerifier_1.default)(toApproveEmail);
        const selectEmailQuery = `
            SELECT *
            FROM ${DB_stage}.email_approvals
            WHERE
                email = '${toApproveEmail}' AND
                user_id = ${(_a = service.USER_req) === null || _a === void 0 ? void 0 : _a.Id} AND
                created = (SELECT max(created) FROM ${DB_stage}.email_approvals)
        `;
        const emailApproval = await DB_connection.query(selectEmailQuery)
            .then(result => {
            var _a, _b;
            if (result.rowCount == 0)
                throw new Error("Nenhum pedido de aprovação para esse email foi encontrado.");
            const emailApproval = new EmailApproval_1.EmailApprovalSql(result.rows[0]);
            if (emailApproval.Approved)
                throw new Error("Email já aprovado.");
            if (((_a = service.USER_req) === null || _a === void 0 ? void 0 : _a.Id) != emailApproval.UserId) {
                new EmailSender_1.default().Internal(EmailTitlesEnum_1.default.DIFFERENT_USER_ON_EMAIL_APPROVAL, `Usuário ${(_b = service.USER_req) === null || _b === void 0 ? void 0 : _b.GenerateUserKey()} tentou aprovar o email ${emailApproval.Email} pertencente ao usuário ${emailApproval.Id}.`);
                throw new Error("Você não pode realizar essa aprovação.");
            }
            return emailApproval;
        })
            .catch(ex => { throw new Error(ex.message); });
        // A partir daqui é garantido que o usuário requeridor é quem está tentando aprovar o email.
        const approveEmailQuery = `CALL ${DB_stage}.approve_user_email('${DB_stage}', ${emailApproval.UserId}, ${emailApproval.Id})`;
        await DB_connection.query(approveEmailQuery)
            .then(() => { })
            .catch(ex => {
            throw new Error(ex.message);
        });
        Responses_1.default.Ok(RES, "Email aprovado com sucesso!", action);
    }
    catch (ex) {
        Responses_1.default.Error(service.RES, `Houve um erro ao aprovar o email. Erro: ${ex.message}`, action);
    }
    finally {
        service.DB_connection.end();
    }
}
exports.default = ApproveUserEmailService;
function CheckQuery(query) {
    if ((0, IsUndNull_1.default)(query.email))
        throw new Error("Email de usuário não encontrado na requisição.");
    return query.email;
}
//# sourceMappingURL=ApproveUserEmailService.js.map
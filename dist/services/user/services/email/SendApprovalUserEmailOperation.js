"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const EmailSender_1 = __importDefault(require("../../../../functions/system/EmailSender"));
const IsUndNull_1 = __importDefault(require("../../../../functions/IsUndNull"));
const QueryDbRowByProperty_1 = __importDefault(require("../../../../functions/SQL/QueryDbRowByProperty"));
const EmailTitlesEnum_1 = __importDefault(require("../../../../enums/EmailTitlesEnum"));
async function SendApprovalEmailOperation(user, db_stage, db_connection, is_creation = false) {
    if (is_creation || (0, IsUndNull_1.default)(user.Id))
        user.Id = await (0, QueryDbRowByProperty_1.default)(db_connection, db_stage, "users", "username", user.Username, "id");
    const createEmailApprovalQuery = `
        INSERT INTO ${db_stage}.email_approvals (user_id, email, approved)
        VALUES
        (
            ${user.Id},
            '${user.Email}',
            false
        )
    `;
    const saudation = `Olá ${user.Name}, bem vindo(a) a CuiCodeSystems!`;
    return await db_connection.query(createEmailApprovalQuery)
        .then(() => {
        const emailBody = `${saudation} Acesse esse link para aprovar seu email no ERP:\n${GeneratEndpoint(db_stage, user.Id, user.Email)}.`;
        new EmailSender_1.default().External(EmailTitlesEnum_1.default.EMAIL_APPROVAL_REQUEST, emailBody, user.Email);
        return true;
    })
        .catch(ex => {
        const emailBody = `${saudation} Houve um erro ao criar o seu pedido de aprovação de email, por favor realize a operação novamente manualmente no ERP:\n${GeneratEndpoint(db_stage, user.Id, user.Email)}.`;
        new EmailSender_1.default().External(EmailTitlesEnum_1.default.EMAIL_APPROVAL_REQUEST, emailBody, user.Email);
        new EmailSender_1.default().Internal(EmailTitlesEnum_1.default.EMAIL_APPROVAL_ERROR, ex.message);
        return false;
    });
}
exports.default = SendApprovalEmailOperation;
function GeneratEndpoint(db_stage, id, email) {
    let url = "";
    switch (db_stage) {
        case "production":
            url += "";
            break;
        case "staging":
            url += "";
            break;
        case "testing":
            url += `http://127.0.0.1:5001/cuicode-systems/us-central1/ApproveUserEmail`;
            break;
        default:
            url += `http://127.0.0.1:5001/cuicode-systems/us-central1/ApproveUserEmail`;
    }
    return url + `?UserReqId=${id}&email=${email}`;
}
//# sourceMappingURL=SendApprovalUserEmailOperation.js.map
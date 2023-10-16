"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailApprovalSql = exports.EmailApproval = void 0;
const Entity_1 = __importDefault(require("./Entity"));
class EmailApproval extends Entity_1.default {
    constructor(id, user_id, email, approved) {
        super();
        this.Id = id;
        this.UserId = user_id;
        this.Email = email;
        this.Approved = approved;
    }
}
exports.EmailApproval = EmailApproval;
class EmailApprovalSql extends EmailApproval {
    constructor(row) {
        super(row["id"], row["user_id"], row["email"], row["approved"]);
        this.RawData = row;
    }
}
exports.EmailApprovalSql = EmailApprovalSql;
//# sourceMappingURL=EmailApproval.js.map
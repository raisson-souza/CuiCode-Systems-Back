"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const CaseUndNull_1 = __importDefault(require("../CaseUndNull"));
class EmailSender {
    constructor() {
        this.Transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: 'raisson.testes@gmail.com',
                pass: 'evne uzxd elkq tgyn'
            }
        });
    }
    Internal(title, emailBody = null) {
        this.Transporter.sendMail(this.BuildEmailTransporter(title, emailBody));
    }
    External(title, emailBody = null, receiverEmail = null) {
        this.Transporter.sendMail(this.BuildEmailTransporter(title, emailBody, receiverEmail));
    }
    BuildEmailTransporter(title, emailBody = null, receiverEmail = null) {
        return {
            from: "CuiCodeSystems",
            to: (0, CaseUndNull_1.default)(receiverEmail, "raisson.testes@gmail.com"),
            subject: `CuiCodeSystems - ${title}`,
            text: (0, CaseUndNull_1.default)(emailBody, ""),
            html: ""
        };
    }
}
exports.default = EmailSender;
//# sourceMappingURL=EmailSender.js.map
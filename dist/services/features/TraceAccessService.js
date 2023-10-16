"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require('nodemailer');
const Responses_1 = __importDefault(require("../../functions/Responses"));
const GetDate_1 = __importDefault(require("../../functions/GetDate"));
async function TraceAccessService(
// ALTERAR PARA SERVICE
req, res) {
    try {
        const body = req.body;
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'raisson.testes@gmail.com',
                pass: 'evne uzxd elkq tgyn'
            }
        });
        const date = (0, GetDate_1.default)();
        let mailOptions = {
            from: "Server",
            to: 'raissonrai@gmail.com',
            subject: `CuiCode Systems TraceAccessService (${date})`,
            text: "text",
            html: JSON.stringify(body)
        };
        transporter.sendMail(mailOptions)
            .then(() => {
            Responses_1.default.Ok(res, "Email enviado.", "Envio de e-mail");
        })
            .catch((ex) => {
            Responses_1.default.Error(res, `Houve um erro no envio do email. Erro: ${ex.message}`, "Envio de e-mail");
        });
    }
    catch (ex) {
        Responses_1.default.Error(res, `Houve um erro no envio do email. Erro: ${ex.message}`, "Envio de e-mail");
    }
}
exports.default = TraceAccessService;
//# sourceMappingURL=TraceAccessService.js.map
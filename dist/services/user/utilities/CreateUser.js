"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ToSqlDate_1 = __importDefault(require("../../../functions/SQL/ToSqlDate"));
const crypto_js_1 = __importDefault(require("crypto-js"));
/**
 * Creates a user.
 */
async function CreateUser(db_connection, db_stage, user) {
    var _a;
    try {
        EncryptUserPassword(user);
        let query = `
            INSERT INTO ${db_stage}.users (${GenerateUserFields()}) VALUES 
            (
                '${user.Username}',
                '${user.Name}',
                ${(0, ToSqlDate_1.default)(user.BirthDate)},
                '${user.Email}',
                '${user.RecoveryEmail}',
                '${user.Phone}',
                '${user.Password}',
                '${user.PasswordHint}',
                '${user.PhotoBase64}',
                ${(_a = user.Sex) === null || _a === void 0 ? void 0 : _a.Value}
            )
        `;
        query.trim();
        await db_connection.query(query)
            .then(() => { })
            .catch(ex => {
            throw new Error(ex.message);
        });
    }
    catch (ex) {
        throw new Error(ex.message);
    }
}
exports.default = CreateUser;
function GenerateUserFields() {
    return `
        "username",
        "name",
        "birthdate",
        "email",
        "recovery_email",
        "phone",
        "password",
        "password_hint",
        "photo_base_64",
        "sex"
    `;
}
function EncryptUserPassword(user) {
    user.Password = crypto_js_1.default.MD5(user.Password).toString();
}
//# sourceMappingURL=CreateUser.js.map
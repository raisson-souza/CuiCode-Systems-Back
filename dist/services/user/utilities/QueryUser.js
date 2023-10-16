"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../../classes/User"));
const IsUndNull_1 = __importDefault(require("../../../functions/IsUndNull"));
/**
 * Queries information about a user.
 * @param db_connection
 * @param db_stage
 * @param userId
 * @returns
 */
async function QueryUser(db_connection, db_stage, userId) {
    try {
        if ((0, IsUndNull_1.default)(userId))
            throw new Error("Id de usuário deve ser informado.");
        const query = `SELECT * FROM ${db_stage}.users WHERE id = ${userId}`;
        return await db_connection.query(query)
            .then(result => {
            // EM CASO DE BUSCA DE USUÁRIO REQUERIDOR, RETORNAR ERRO DIFERENTE
            if (result.rowCount == 0)
                throw new Error("Nenhum usuário encontrado.");
            const user = new User_1.default(result.rows[0], true);
            return user;
        })
            .catch(ex => {
            throw new Error(ex.message);
        });
    }
    catch (ex) {
        throw new Error(ex.message);
    }
}
exports.default = QueryUser;
//# sourceMappingURL=QueryUser.js.map
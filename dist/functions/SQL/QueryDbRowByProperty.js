"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IsUndNull_1 = __importDefault(require("../IsUndNull"));
const SqlLabel_1 = __importDefault(require("../../classes/SqlLabel"));
/**
 * Queries a user by a property.
 * @param db_connection
 * @param db_stage
 * @param dbTable Tabela do banco a ser realizada query
 * @param userSqlColumn Coluna a ser aplicado WHERE
 * @param userSqlColumnValue Valor da coluna a ser procurado na tabela
 * @param extractColumnName Valor da coluna na linha encontrada a ser extraido
 * @returns
 */
async function QueryDbRowByProperty(db_connection, db_stage, dbTable, userSqlColumn, userSqlColumnValue, extractColumnName = null // Caso nulo retorna toda a linha
) {
    try {
        if ((0, IsUndNull_1.default)(userSqlColumn) || (0, IsUndNull_1.default)(userSqlColumnValue))
            throw new Error("Coluna ou valor devem ser informados.");
        const query = `
            SELECT *
            FROM ${db_stage}.${dbTable}
            WHERE
                ${userSqlColumn} = ${SqlLabel_1.default.ParsePropNameToSql(typeof userSqlColumnValue, userSqlColumnValue)}
        `;
        return await db_connection.query(query)
            .then(result => {
            if (result.rowCount == 0)
                throw new Error("Nenhum dado encontrado.");
            if (!(0, IsUndNull_1.default)(extractColumnName))
                return result.rows[0][extractColumnName];
            return result.rows[0];
        })
            .catch(ex => {
            throw new Error(ex.message);
        });
    }
    catch (ex) {
        throw new Error(ex.message);
    }
}
exports.default = QueryDbRowByProperty;
//# sourceMappingURL=QueryDbRowByProperty.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Queries specific information about all users.
 * @param db_connection
 * @param db_stage
 * @param requiredInfo
 * @returns
 */
async function QueryUsersInfo(db_connection, db_stage, requiredInfo) {
    try {
        if (requiredInfo.length == 0)
            throw new Error("Nenhuma informação requerida.");
        let query = "SELECT";
        requiredInfo.forEach((info, i) => {
            if (i != requiredInfo.length - 1)
                query += ` "${info}",`;
            else
                query += ` "${info}" `;
        });
        query += `FROM ${db_stage}.users`;
        return await db_connection.query(query)
            .then(result => {
            if (result.rowCount == 0)
                return null;
            return result.rows;
        })
            .catch(ex => {
            throw new Error(ex.message);
        });
    }
    catch (ex) {
        throw new Error(ex.message);
    }
}
exports.default = QueryUsersInfo;
//# sourceMappingURL=QueryUsersInfo.js.map
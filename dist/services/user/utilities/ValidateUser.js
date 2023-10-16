"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Validates a user
 */
async function ValidateUser(db_connection, db_stage, user, isCreation = false) {
    try {
        const query = `
            SELECT
                *
            FROM
                ${db_stage}.users
            WHERE
                ${!isCreation
            ? `id != ${user.Id} AND (${GenereateUserComparisonQuery(user)})`
            : GenereateUserComparisonQuery(user)}
        `;
        await db_connection.query(query)
            .then(result => {
            if (result.rowCount > 0) {
                result.rows.forEach(userDb => {
                    if (userDb["username"] == user.Username)
                        throw new Error("Nome de usuário já utilizado.");
                    if (userDb["email"] == user.Email)
                        throw new Error("Email já utilizado.");
                    if (userDb["recovery_email"] == user.RecoveryEmail)
                        throw new Error("Email de recuperação já utilizado.");
                    if (userDb["phone"] == user.Phone)
                        throw new Error("Número de telefone já utilizado.");
                });
            }
        })
            .catch(ex => {
            throw new Error(ex.message);
        });
    }
    catch (ex) {
        throw new Error(ex.message);
    }
}
exports.default = ValidateUser;
function GenereateUserComparisonQuery(user) {
    return `
        username = '${user.Username}' OR
        email = '${user.Email}' OR
        recovery_email = '${user.RecoveryEmail}' OR
        phone = '${user.Phone}'
    `;
}
//# sourceMappingURL=ValidateUser.js.map
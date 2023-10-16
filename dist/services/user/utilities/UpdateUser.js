"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SqlLabel_1 = __importDefault(require("../../../classes/SqlLabel"));
const EmailTitlesEnum_1 = __importDefault(require("../../../enums/EmailTitlesEnum"));
const IsUndNull_1 = __importDefault(require("../../../functions/IsUndNull"));
const EmailSender_1 = __importDefault(require("../../../functions/system/EmailSender"));
/**
 * Updates a user.
 */
async function UpdateUser(db_connection, db_stage, user) {
    try {
        if ((0, IsUndNull_1.default)(user.Id))
            throw new Error("Id do usuário a ser editado deve ser informado.");
        const userInSql = user.ConvertUserToSqlObject();
        const checkUserExistenceQuery = `SELECT * FROM ${db_stage}.users WHERE id = ${user.Id}`;
        const userDb = await db_connection.query(checkUserExistenceQuery)
            .then(result => {
            if (result.rowCount == 0)
                throw new Error(`Usuário ${user.GenerateUserKey()} não encontrado.`);
            // userDb assume o tipo de userInSql que utiliza de assinatura de índice
            // na qual permite acesso as chaves por qualquer string.
            return result.rows[0];
        })
            .catch(ex => {
            throw new Error(ex.message);
        });
        let newUserProps = [];
        // Serão comparadas as diferenças entre o usuário do banco com as novas alterações.
        // Um objeto contendo o nome da coluna, o valor e o tipo do valor será criado.
        for (let prop in userDb) {
            if (userDb[prop] != userInSql[prop] && prop != "id" && !(0, IsUndNull_1.default)(userInSql[prop])) {
                newUserProps.push(new SqlLabel_1.default(prop, userInSql[prop]));
                // Se um dos parâmetros do usuário a ser editado é o email, o novo email deve ser validado.
                if (prop == "email") {
                    newUserProps.push(new SqlLabel_1.default("email_approved", false));
                    user.EmailAproved = false;
                }
                if (prop == "username" && userDb["email_approved"] == false)
                    throw new Error("Para editar o username é necessário aprovar o email.");
                if (prop == "active" || prop == "deleted")
                    DetectUserDeactivationOrDeletion(prop, userInSql[prop], user, userDb);
            }
        }
        if (newUserProps.length == 0)
            throw new Error("Nenhuma edição realizada no usuário.");
        const userPutQuery = `UPDATE ${db_stage}.users SET ${BuildUserPutQuery(newUserProps)} WHERE id = ${user.Id}`;
        await db_connection.query(userPutQuery)
            .then(async () => { })
            .catch(ex => {
            throw new Error(ex.message);
        });
    }
    catch (ex) {
        throw new Error(ex.message);
    }
}
exports.default = UpdateUser;
function BuildUserPutQuery(newPropsList) {
    let setQuery = "";
    newPropsList.forEach((prop, i) => {
        if (!(0, IsUndNull_1.default)(prop.ColumnValue)) {
            setQuery += `${prop.ColumnName} = ${prop.ParsePropNameToSql()}`;
            setQuery += (i < newPropsList.length - 1) ? ", " : "";
        }
    });
    return setQuery;
}
/**
 * Envia email de registro ao sistema em caso de desativação ou exclusão de usuário.
 * @param action Ação (desativação / exclusão).
 * @param user Usuário recém editado (novo).
 * @param userDb Usuário no banco (antigo).
 */
function DetectUserDeactivationOrDeletion(actionName, action, user, userDb) {
    let emailMessage = `Usuário ${(0, IsUndNull_1.default)(user.Name) ? userDb["name"] : user.Name} (${user.GenerateUserKey()}) foi `;
    if (actionName == "active") {
        emailMessage += action
            ? "ativado(a) "
            : "desativado(a) ";
    }
    else {
        emailMessage += action
            ? "excluído(a) "
            : "restaurado(a) ";
    }
    emailMessage += "no sistema.";
    new EmailSender_1.default().Internal(EmailTitlesEnum_1.default.USER_DEACTIVATED, emailMessage);
}
//# sourceMappingURL=UpdateUser.js.map
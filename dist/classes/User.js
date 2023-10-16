"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_1 = __importDefault(require("./Entity"));
const Label_1 = __importDefault(require("./Label"));
const PermissionLevelEnum_1 = __importDefault(require("../enums/PermissionLevelEnum"));
const SexEnum_1 = __importDefault(require("../enums/SexEnum"));
const FormatIdNumber_1 = __importDefault(require("../functions/FormatIdNumber"));
const IsUndNull_1 = __importDefault(require("../functions/IsUndNull"));
const PermissionLevelToNumber_1 = __importDefault(require("../functions/PermissionLevelToNumber"));
class User extends Entity_1.default {
    constructor(body, isBodySQL = false, isCreation = false, isUpdate = false) {
        super();
        try {
            this.ConvertBody(body, isBodySQL);
            if (isCreation || isUpdate)
                this.ValidateUserInfo(isUpdate);
        }
        catch (ex) {
            throw new Error(ex.message);
        }
    }
    /**
     * Converts the body into the instantiation of User.
     * @param body Body object to convert.
     * @param isSQL Is the body in SQL form of user.
     */
    ConvertBody(body, isSQL = false) {
        this.Id = body[!isSQL ? "Id" : "id"];
        this.Username = body[!isSQL ? "Username" : "username"];
        this.Name = body[!isSQL ? "Name" : "name"];
        this.BirthDate = body[!isSQL ? "BirthDate" : "birthdate"];
        this.Email = body[!isSQL ? "Email" : "email"];
        this.RecoveryEmail = body[!isSQL ? "RecoveryEmail" : "recovery_email"];
        this.Phone = body[!isSQL ? "Phone" : "phone"];
        this.Password = body[!isSQL ? "Password" : "password"];
        this.PasswordHint = body[!isSQL ? "PasswordHint" : "password_hint"];
        this.PhotoBase64 = body[!isSQL ? "PhotoBase64" : "photo_base_64"];
        this.PermissionLevel = this.ConvertLevelEnum(body, isSQL);
        this.Sex = this.ConvertSexEnum(body, isSQL);
        this.EmailAproved = body[!isSQL ? "EmailAproved" : "email_aproved"];
        this.Active = body[!isSQL ? "Active" : "active"];
        this.CreatedDate = body[!isSQL ? "CreatedDate" : "created_date"];
        this.Deleted = body[!isSQL ? "Deleted" : "deleted"];
    }
    /**
     * Validates user's info
     */
    ValidateUserInfo(isUpdate) {
        // Se não estiver atulizando (e sim criando) validar valores indefinidos
        // (na edição nem todos os valores são preenchidos)
        if (!isUpdate)
            this.ValidateEmptyness();
        if (isPropUpdating(isUpdate, this.Username))
            this.ValidateUsername();
        // Adaptar função isPropUpdating para validar mais de uma propriedade
        if (((!(0, IsUndNull_1.default)(this.Email) && !(0, IsUndNull_1.default)(this.RecoveryEmail)) &&
            isUpdate) ||
            !isUpdate) {
            if (this.Email.indexOf("@") == -1 || this.RecoveryEmail.indexOf("@") == -1)
                throw new Error("Email ou email de recuperação inválido.");
        }
        if (isPropUpdating(isUpdate, this.Password)) {
            if (this.Password.search(/^[0-9]+$/) != -1)
                throw new Error("A senha não pode conter apenas números.");
            if (this.Password.search(/\d+/g) == -1)
                throw new Error("A senha não pode conter apenas letras.");
        }
        // Necessário implementar maneira de captar o nome e a dica de senha para validar a nova senha
        if (!isUpdate) {
            if (this.PasswordHint.includes(this.Password))
                throw new Error("A senha não pode estar presente na dica da senha.");
            this.Name.toLocaleLowerCase().split(" ").forEach(namePart => {
                if (this.Password.includes(namePart))
                    throw new Error("A senha não pode conter partes do nome do usuário.");
            });
        }
    }
    /**
     * Validates the rightness of a username user
     */
    ValidateUsername() {
        if (this.Username.length > 20)
            throw new Error("Username além do limite.");
        if (this.Username.charAt(0) != "@")
            throw new Error("Username inválido.");
        let newUsername = this.Username.replace("@", "").split("");
        if (newUsername.includes("@"))
            throw new Error("Username inválido.");
        const UnwantedCharacters = ["!", "?", "#", "$", "%", "¨", "&", "*", "(", ")", "-", "=", "+", "°", '"', "'", "´", "`", "[", "]", "{", "}", ",", "."];
        UnwantedCharacters.forEach(character => {
            if (this.Username.includes(character))
                throw new Error("Username inválido.");
        });
    }
    /**
     * Validates any undefined propertie into User.
     */
    ValidateEmptyness() {
        if ((0, IsUndNull_1.default)(this.Username))
            throw new Error("Username de usuário inválido.");
        if ((0, IsUndNull_1.default)(this.Name))
            throw new Error("Nome de usuário inválido.");
        if ((0, IsUndNull_1.default)(this.BirthDate))
            throw new Error("Data de aniversário de usuário inválida.");
        if ((0, IsUndNull_1.default)(this.Email))
            throw new Error("Email de usuário inválido.");
        if ((0, IsUndNull_1.default)(this.RecoveryEmail))
            throw new Error("Email de recuperação de usuário inválido.");
        if ((0, IsUndNull_1.default)(this.Phone))
            throw new Error("Número de celular de usuário inválido.");
        if ((0, IsUndNull_1.default)(this.Password))
            throw new Error("Senha de usuário inválida.");
        if ((0, IsUndNull_1.default)(this.PasswordHint))
            throw new Error("Dica de senha de usuário inválida.");
        if ((0, IsUndNull_1.default)(this.Sex))
            throw new Error("Sexo de usuário inválido.");
    }
    /**
     * Generates non obligational user key for identification
     */
    GenerateUserKey() {
        if (!(0, IsUndNull_1.default)(this.Username) && !(0, IsUndNull_1.default)(this.Id))
            return `${this.Username}#${(0, FormatIdNumber_1.default)(this.Id)}`;
        if (!(0, IsUndNull_1.default)(this.Id))
            return `#${(0, FormatIdNumber_1.default)(this.Id)}`;
        if (!(0, IsUndNull_1.default)(this.Username))
            return this.Username;
        return undefined;
    }
    /**
     * Converts sex into sex enum
     */
    ConvertSexEnum(body, isBodySQL) {
        const bodyProp = !isBodySQL ? "Sex" : "sex";
        return (0, IsUndNull_1.default)(body[bodyProp])
            ? null
            : new Label_1.default(SexEnum_1.default, body[bodyProp], "Sex");
    }
    /**
     * Converts permission level into permission level enum
     */
    ConvertLevelEnum(body, isBodySQL) {
        const bodyProp = !isBodySQL ? "PermissionLevel" : "permission_level";
        return (0, IsUndNull_1.default)(body[bodyProp])
            ? null
            : new Label_1.default(PermissionLevelEnum_1.default, body[bodyProp], "PermissionLevel");
    }
    /**
     * Checks user's permission level to perform an action.
     * @param levelRequired
     */
    CheckUserPermission(levelRequired) {
        var _a, _b;
        if ((0, IsUndNull_1.default)((_a = this.PermissionLevel) === null || _a === void 0 ? void 0 : _a.Value))
            throw new Error("Nível de permissão de usuário não encontrado.");
        if ((0, IsUndNull_1.default)(this.EmailAproved) || !this.EmailAproved)
            throw new Error("Email de usuário não aprovado, ação negada.");
        const userLevel = (0, PermissionLevelToNumber_1.default)(PermissionLevelEnum_1.default[(_b = this.PermissionLevel) === null || _b === void 0 ? void 0 : _b.Value]);
        if (userLevel < levelRequired)
            throw new Error("Nível de permissão não alto o suficiente para realizar esta ação.");
    }
    ConvertUserToSqlObject() {
        const userInSql = {
            "id": this.Id,
            "username": this.Username,
            "name": this.Name,
            "birthdate": this.BirthDate,
            "email": this.Email,
            "recovery_email": this.RecoveryEmail,
            "phone": this.Phone,
            "password": this.Password,
            "password_hint": this.PasswordHint,
            "photo_base_64": this.PhotoBase64,
            "permission_level": this.PermissionLevel,
            "sex": this.Sex,
            "email_approved": this.EmailAproved,
            "active": this.Active,
            "created_date": this.CreatedDate,
            "deleted": this.Deleted
        };
        return userInSql;
    }
}
exports.default = User;
/**
 * Função especifica para a instânciação de um usuário a ser atualizado.
 * Valida se uma propriedade existe e se a ação é de edição,
 * o que significa que se está editando OU se não estiver editando,
 * o que significa que está criando e a validação seguinte deve ocorrer.
 */
function isPropUpdating(isUpdate, prop) {
    return (!(0, IsUndNull_1.default)(prop) && isUpdate) || !isUpdate;
    /*
        (!IsUndNull(prop) && isUpdate):
            Se a prop não é nula e se esta editando, a prop foi editada e deve ser validada.
        
        !isUpdate:
            Se não se está editando, logicamente está se criando, portanto, a prop existe e deve ser validada.
    */
}
//# sourceMappingURL=User.js.map
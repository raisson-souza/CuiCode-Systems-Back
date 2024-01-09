import Entity from "./Entity"
import Label from "./Label"

import IUserInSql from "../interfaces/IUserInSql"

import FormatIdNumber from "../functions/FormatIdNumber"
import IsUndNull from "../functions/IsUndNull"
import PermissionLevelToNumber from "../functions/enums/PermissionLevelToNumber"

import PermissionLevel from "../enums/PermissionLevelEnum"
import Sex from "../enums/SexEnum"

class User extends Entity
{
    // Identificação
    Username: string
    Name : string

    // Dados pessoais
    BirthDate: Date
    Email: string
    RecoveryEmail: string
    Phone: string
    Password: string
    PasswordHint: string
    PhotoBase64 : string

    // Informações de usuário
    PermissionLevel: Label | null
    Sex: Label | null
    EmailAproved : boolean

    constructor(
        body : any,
        isBodySQL = false,
        isCreation : boolean = false,
        isUpdate : boolean = false
    ) {
        super()
        try
        {
            this.ConvertBody(body, isBodySQL)
            if (isCreation || isUpdate)
                this.ValidateUserInfo(isUpdate)
        }
        catch (ex)
        {
            throw new Error((ex as Error).message)
        }
    }

    /**
     * Converts the body into the instantiation of User.
     * @param body Body object to convert.
     * @param isSQL Is the body in SQL form of user.
     */
    private ConvertBody(body : any, isSQL = false) : void
    {
        this.Id = body[!isSQL ? "Id" : "id"]
        this.Username = body[!isSQL ? "Username" : "username"]
        this.Name = body[!isSQL ? "Name" : "name"]
        this.BirthDate = body[!isSQL ? "BirthDate" : "birthdate"]
        this.Email = body[!isSQL ? "Email" : "email"]
        this.RecoveryEmail = body[!isSQL ? "RecoveryEmail" : "recovery_email"]
        this.Phone = body[!isSQL ? "Phone" : "phone"]
        this.Password = body[!isSQL ? "Password" : "password"]
        this.PasswordHint = body[!isSQL ? "PasswordHint" : "password_hint"]
        this.PhotoBase64 = body[!isSQL ? "PhotoBase64" : "photo_base_64"]
        this.PermissionLevel = this.ConvertLevelEnum(body, isSQL)
        this.Sex = this.ConvertSexEnum(body, isSQL)
        this.EmailAproved = body[!isSQL ? "EmailAproved" : "email_aproved"]
        this.Active = body[!isSQL ? "Active" : "active"]
        this.CreatedDate = body[!isSQL ? "CreatedDate" : "created_date"]
        this.Deleted = body[!isSQL ? "Deleted" : "deleted"]
    }

    /**
     * Validates user's info
     */
    private ValidateUserInfo(isUpdate : boolean) : void
    {
        // Se não estiver atulizando (e sim criando) validar valores indefinidos
        // (na edição nem todos os valores são preenchidos)
        if (!isUpdate)
            this.ValidateEmptyness()

        if (this.IsPropUpdating(isUpdate, this.Username))
            this.ValidateUsername()

        // Adaptar função IsPropUpdating para validar mais de uma propriedade
        if (
            (
                (!IsUndNull(this.Email) && !IsUndNull(this.RecoveryEmail)) &&
                isUpdate
            ) ||
            !isUpdate
        )
        {
            if (this.Email.indexOf("@") == -1 || this.RecoveryEmail.indexOf("@") == -1)
                throw new Error("Email ou email de recuperação inválido.")
        }

        if (this.IsPropUpdating(isUpdate, this.Password))
        {
            if (this.Password.search(/^[0-9]+$/) != -1)
                throw new Error("A senha não pode conter apenas números.")

            if (this.Password.search(/\d+/g) == -1)
                throw new Error("A senha não pode conter apenas letras.")
        }

        // Necessário implementar maneira de captar o nome e a dica de senha para validar a nova senha
        if (!isUpdate)
        {
            if (this.PasswordHint.includes(this.Password))
                throw new Error("A senha não pode estar presente na dica da senha.")

            this.Name.toLocaleLowerCase().split(" ").forEach(namePart => {
                if (this.Password.includes(namePart))
                    throw new Error("A senha não pode conter partes do nome do usuário.")
            })
        }
    }

    /**
     * Validates the rightness of a username user
     */
    private ValidateUsername() : void
    {
        if (this.Username.length > 20)
            throw new Error("Username além do limite.")
        
        if (this.Username.charAt(0) != "@")
            throw new Error("Username inválido.")

        let newUsername = this.Username.replace("@", "").split("")

        if (newUsername.includes("@"))
            throw new Error("Username inválido.")

        const UnwantedCharacters = ["!", "?", "#", "$", "%", "¨", "&", "*", "(", ")", "-", "=", "+", "°", '"', "'", "´", "`", "[", "]", "{", "}", ",", "."]

        UnwantedCharacters.forEach(character => {
            if (this.Username.includes(character))
                throw new Error("Username inválido.")
        })
    }

    /**
     * Validates any undefined propertie into User.
     */
    private ValidateEmptyness() : void
    {
        if (IsUndNull(this.Username))
            throw new Error("Username de usuário inválido.")

        if (IsUndNull(this.Name))
            throw new Error("Nome de usuário inválido.")

        if (IsUndNull(this.BirthDate))
            throw new Error("Data de aniversário de usuário inválida.")

        if (IsUndNull(this.Email))
            throw new Error("Email de usuário inválido.")

        if (IsUndNull(this.RecoveryEmail))
            throw new Error("Email de recuperação de usuário inválido.")

        if (IsUndNull(this.Phone))
            throw new Error("Número de celular de usuário inválido.")

        if (IsUndNull(this.Password))
            throw new Error("Senha de usuário inválida.")

        if (IsUndNull(this.PasswordHint))
            throw new Error("Dica de senha de usuário inválida.")

        if (IsUndNull(this.Sex))
            throw new Error("Sexo de usuário inválido.")
    }

    /**
     * Gera uma chave de identificação de usuário sem consulta no banco, apenas usando dados disponíveis.
     */
    GenerateUserKey() : string | undefined
    {
        if (!IsUndNull(this.Username) && !IsUndNull(this.Id))
            return `${ this.Username }#${ FormatIdNumber(this.Id) }`

        if (!IsUndNull(this.Id))
            return `#${FormatIdNumber(this.Id)}`

        if (!IsUndNull(this.Username))
            return this.Username

        return undefined
    }

    /**
     * Converts sex into sex enum
     */
    private ConvertSexEnum(body : any, isBodySQL : boolean)
    {
        const bodyProp = !isBodySQL ? "Sex" : "sex"

        if (typeof body[bodyProp] === "object") // TODO: Validar body[bodyProp] instanceof Label
            return body[bodyProp]

        return IsUndNull(body[bodyProp])
            ? null
            : new Label(Sex, body[bodyProp], "Sex")
    }

    /**
     * Converts permission level into permission level enum
     */
    private ConvertLevelEnum(body : any, isBodySQL : boolean)
    {
        const bodyProp = !isBodySQL ? "PermissionLevel" : "permission_level"

        if (typeof body[bodyProp] === "object")
            return body[bodyProp]

        return IsUndNull(body[bodyProp])
            ? null
            : new Label(PermissionLevel, body[bodyProp], "PermissionLevel")
    }

    /**
     * Checks user's permission level to perform an action.
     * @param levelRequired
     */
    CheckUserPermission(levelRequired : PermissionLevel)
    {
        if (IsUndNull(this.PermissionLevel?.Value))
            throw new Error("Nível de permissão de usuário não encontrado.")

        const userLevel = PermissionLevelToNumber(PermissionLevel[this.PermissionLevel?.Value!])

        if (userLevel < levelRequired)
            throw new Error("Ação não autorizada para o usuário.")
    }

    ConvertUserToSqlObject()
    {
        const userInSql : IUserInSql = {
            "id": this.Id,
            "username": this.Username,
            "name" : this.Name,
            "birthdate": this.BirthDate,
            "email": this.Email,
            "recovery_email": this.RecoveryEmail,
            "phone": this.Phone,
            "password": this.Password,
            "password_hint": this.PasswordHint,
            "photo_base_64" : this.PhotoBase64,
            "permission_level": this.PermissionLevel,
            "sex": this.Sex,
            "email_approved" : this.EmailAproved,
            "active": this.Active,
            "created_date": this.CreatedDate,
            "deleted": this.Deleted
        }

        return userInSql
    }

    /**
     * Função especifica para a instânciação de um usuário a ser atualizado.
     * Valida se uma propriedade existe e se a ação é de edição,
     * o que significa que se está editando OU se não estiver editando,
     * o que significa que está criando e a validação seguinte deve ocorrer.
     */
    private IsPropUpdating(isUpdate : boolean, prop : any) : boolean
    {
        return (!IsUndNull(prop) && isUpdate) || !isUpdate
        /*
            (!IsUndNull(prop) && isUpdate):
                Se a prop não é nula e se esta editando, a prop foi editada e deve ser validada.
            
            !isUpdate:
                Se não se está editando, logicamente está se criando, portanto, a prop existe e deve ser validada.
        */
    }

    CheckUserValidity() : void
    {
        if (IsUndNull(this.Active) || IsUndNull(this.Deleted))
            throw new Error("Usuário inapto para tal ação.")

        if (this.Active === false || this.Deleted === true)
            throw new Error("Usuário inapto para tal ação.")
    }
}

export default User
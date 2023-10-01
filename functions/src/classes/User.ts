import Label from "./Label"

import PermissionLevel from "../enums/PermissionLevelEnum"
import Sex from "../enums/SexEnum"

import FormatIdNumber from "../functions/FormatIdNumber"
import IsUndNull from "../functions/IsUndNull"
import PermissionLevelToNumber from "../functions/PermissionLevelToNumber"
import UserInSql from "../interfaces/UserInSql"

export default class User
{
    // Identificação
    Id: number
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
    Active: boolean
    CreatedDate: Date
    Deleted: boolean

    constructor(
        body : any,
        isBodySQL = false,
    ) {
        try
        {
            this.ConvertBody(body, isBodySQL)
        }
        catch (ex)
        {
            throw new Error((ex as Error).message)
        }
    }

    private ConvertBody
    (
        body : any,
        isSQL = false
    )
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
     * Validates the rightness of a username user
     * @param username 
     */
    static ValidateUsername(username: string) : void
    {
        if (username.length > 20)
            throw new Error("Username além do limite.")
        
        if (username.charAt(0) != "@")
            throw new Error("Username inválido.")

        let newUsername = username.replace("@", "").split("")

        if (newUsername.includes("@"))
            throw new Error("Username inválido.")

        const UnwantedCharacters = ["!", "?", "#", "$", "%", "¨", "&", "*", "(", ")", "-", "=", "+", "°", '"', "'", "´", "`", "[", "]", "{", "}", ",", "."]

        UnwantedCharacters.forEach(character => {
            if (username.includes(character))
                throw new Error("Username inválido.")
        })
    }

    FormatUsername()
    {
        let newUsername = this.Username.toLowerCase()
        this.Username = newUsername.trim()
    }

    GenerateUserKey()
    {
        if (!IsUndNull(this.Username) && !IsUndNull(this.Id))
            return `${ this.Username }#${ FormatIdNumber(this.Id) }`

        if (!IsUndNull(this.Id))
            return `#${FormatIdNumber(this.Id)}`

        if (!IsUndNull(this.Username))
            return this.Username

        return undefined
    }

    private ConvertSexEnum(body : any, isBodySQL : boolean)
    {
        const bodyProp = !isBodySQL ? "Sex" : "sex"

        return IsUndNull(body[bodyProp])
            ? null
            : new Label(Sex, body[bodyProp], "Sex")
    }

    private ConvertLevelEnum(body : any, isBodySQL : boolean)
    {
        const bodyProp = !isBodySQL ? "PermissionLevel" : "permission_level"

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

        if (IsUndNull(this.EmailAproved) || !this.EmailAproved)
            throw new Error("Email de usuário não aprovado, ação negada.")

        const userLevel = PermissionLevelToNumber(PermissionLevel[this.PermissionLevel?.Value!])

        if (userLevel < levelRequired)
            throw new Error("Nível de permissão não alto o suficiente para realizar esta ação.")
    }

    ConvertUserToSqlObject()
    {
        const userInSql : UserInSql = {
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
}

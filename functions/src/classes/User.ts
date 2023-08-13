import BodyChecker from "../functions/BodyChecker"

import Sex from "../enums/Sex"
import PermissionLevel from "../enums/PermissionLevel"

import Label from "./Label"
import IsUndNull from "../functions/IsUndNull"
import FormatIdNumber from "../functions/FormatIdNumber"

const Labels = [
    "Active",
    "CreatedDate",
    "Deleted",
    "Name",
    "BirthDate",
    "Sex",
    "Email",
    "RecoveryEmail",
    "Phone",
    "Password",
    "PasswordHint",
    "Level",
]

export default class User
{
    Id: number
    Username: string
    Active: boolean
    CreatedDate: Date
    Deleted: boolean
    Name : string
    BirthDate: Date
    Sex: Label | null
    Email: string
    RecoveryEmail: string
    Phone: string
    Password: string
    PasswordHint: string
    Level: Label | null

    constructor(
        body : any,
        isModel = false,
        isBodySQL = false,
    ) {
        try
        {
            if (!isModel)
                BodyChecker(body, Labels)

            this.ConvertBody(body, isModel, isBodySQL)
        }
        catch (ex)
        {
            throw new Error((ex as Error).message)
        }
    }

    private ConvertBody
    (
        body : any,
        isModel = false,
        isSQL = false,
    )
    {
        this.Id = body[!isSQL ? "Id" : "id"]
        this.Username = body[!isSQL ? "Username" : "username"]
        this.Active = body[!isSQL ? "Active" : "active"]
        this.CreatedDate = body[!isSQL ? "CreatedDate" : "created_date"]
        this.Deleted = body[!isSQL ? "Deleted" : "deleted"]
        this.Name = body[!isSQL ? "Name" : "name"]
        this.BirthDate = body[!isSQL ? "BirthDate" : "birthdate"]
        this.Sex = this.ConvertSexEnum(body, isModel, isSQL)
        this.Email = body[!isSQL ? "Email" : "email"]
        this.RecoveryEmail = body[!isSQL ? "RecoveryEmail" : "recovery_email"]
        this.Phone = body[!isSQL ? "Phone" : "phone"]
        this.Password = body[!isSQL ? "Password" : "password"]
        this.PasswordHint = body[!isSQL ? "PasswordHint" : "password_hint"]
        this.Level = this.ConvertLevelEnum(body, isModel, isSQL)
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

        return undefined
    }

    private ConvertSexEnum(body : any, isModel: boolean, isBodySQL : boolean)
    {
        const bodyProp = !isBodySQL ? "Sex" : "sex"

        return isModel && IsUndNull(body[bodyProp])
            ? null
            : new Label(Sex, body[bodyProp], "Sex")
    }

    private ConvertLevelEnum(body : any, isModel: boolean, isBodySQL : boolean)
    {
        const bodyProp = !isBodySQL ? "Level" : "permission_level"

        return isModel && IsUndNull(body[bodyProp])
            ? null
            : new Label(PermissionLevel, body[bodyProp], "PermissionLevel")
    }
}

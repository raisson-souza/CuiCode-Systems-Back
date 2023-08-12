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
        isModel = false
    ) {
        try
        {
            if (!isModel)
                BodyChecker(body, Labels)

            this.Id = body["Id"]
            this.Username = body["Username"]
            this.Active = body["Active"]
            this.CreatedDate = body["CreatedDate"]
            this.Deleted = body["Deleted"]
            this.Name = body["Name"]
            this.BirthDate = body["BirthDate"]
            this.Sex = this.ConvertSexEnum(body, isModel)
            this.Email = body["Email"]
            this.RecoveryEmail = body["RecoveryEmail"]
            this.Phone = body["Phone"]
            this.Password = body["Password"]
            this.PasswordHint = body["PasswordHint"]
            this.Level = this.ConvertLevelEnum(body, isModel)
        }
        catch (ex)
        {
            throw new Error((ex as Error).message)
        }
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

    private ConvertSexEnum(body : any, isModel: boolean)
    {
        return isModel && IsUndNull(body["Sex"])
            ? null
            : new Label(Sex, body["Sex"], "Sex")
    }

    private ConvertLevelEnum(body : any, isModel: boolean)
    {
        return isModel && IsUndNull(body["Level"])
            ? null
            : new Label(PermissionLevel, body["Level"], "PermissionLevel")
    }

    static ConvertUserPropsToSQL(userProps : string[]) : string[]
    {
        const convertedProps : string[] = []

        userProps.forEach(prop => {
            switch(prop)
            {
                case "Active":
                    convertedProps.push("active")
                    break
                case "CreatedDate":
                    convertedProps.push("created_date")
                    break
                case "Deleted":
                    convertedProps.push("deleted")
                    break
                case "Name":
                    convertedProps.push("name")
                    break
                case "BirthDate":
                    convertedProps.push("birthdate")
                    break
                case "Sex":
                    convertedProps.push("sex")
                    break
                case "Email":
                    convertedProps.push("email")
                    break
                case "RecoveryEmail":
                    convertedProps.push("recovery_email")
                    break
                case "Phone":
                    convertedProps.push("phone")
                    break
                case "Password":
                    convertedProps.push("password")
                    break
                case "PasswordHint":
                    convertedProps.push("password_hint")
                    break
                case "Level":
                    convertedProps.push("permission_level")
                    break
                default:
                    break
            }
        })

        return convertedProps
    }
}

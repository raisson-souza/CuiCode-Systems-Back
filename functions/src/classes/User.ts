import BodyChecker from "../functions/BodyChecker"

import Sex from "../enums/Sex"
import PermissionLevel from "../enums/PermissionLevel"

import Label from "./Label"

class User
{
    Id: number
    Username: string
    Active: boolean
    CreatedDate: Date
    Deleted: boolean
    Name : string
    BirthDate: Date
    Sex: Label
    Email: string
    RecoveryEmail: string
    Phone: string
    Password: string
    PasswordHint: string
    Level: Label

    constructor(
        body : any,
    ) {
        try
        {
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

            BodyChecker(body, Labels)

            this.Id = body["Id"]
            this.Username = body["Username"]
            this.Active = body["Active"]
            this.CreatedDate = body["CreatedDate"]
            this.Deleted = body["Deleted"]
            this.Name = body["Name"]
            this.BirthDate = body["BirthDate"]
            this.Sex = new Label(Sex, body["Sex"], "Sex")
            this.Email = body["Email"]
            this.RecoveryEmail = body["RecoveryEmail"]
            this.Phone = body["Phone"]
            this.Password = body["Password"]
            this.PasswordHint = body["PasswordHint"]
            this.Level = new Label(PermissionLevel, body["Level"], "PermissionLevel")
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

        const UnwantedCharacters = ["!", "?", "#", "$", "%", "¨", "&", "*", "(", ")", "-", "_", "=", "+", "°", '"', "'", "´", "`", "[", "]", "{", "}", ",", "."]

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
}

export default User

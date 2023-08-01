import BodyChecker from "../functions/BodyChecker"
import Sex from "../enums/Sex"
import PermissionLevel from "../enums/PermissionLevel"
import Label from "./Label"

class User
{
    // username ex: @raisson (validação)
    Id: any // pq any?
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
    Labels: string[] = [
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

    constructor(
        body : any,
    ) {
        try
        {
            BodyChecker(body, this.Labels)
            // passar os labels por aqui sem ser parte da classe

            this.Id = body["Id"]
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
            throw new Error(`Houve um erro ao processar o Usuário. Erro: ${(ex as Error).message}`)
        }
    }
}

export default User

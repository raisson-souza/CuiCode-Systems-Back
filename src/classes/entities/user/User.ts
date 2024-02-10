import Entity from "../base/Entity"
import Label from "../base/Label"

import IUserInSql from "../../../interfaces/AnySearch"

import EncryptInfo from "../../../functions/security/EncryptPassword"
import FormatIdNumber from "../../../functions/formatting/FormatIdNumber"
import IsUndNull from "../../../functions/logic/IsUndNull"

import PermissionLevel from "../../../enums/PermissionLevelEnum"
import Sex from "../../../enums/SexEnum"
import AnySearch from "../../../interfaces/AnySearch"

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

    constructor(body : any )
    {
        try
        {
            super(body)
            this.ConvertBody(body)
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
    private ConvertBody(body : any) : void
    {
        this.Username = !IsUndNull(body["Username"]) ? body["Username"] : body["username"]
        this.Name = !IsUndNull(body["Name"]) ? body["Name"] : body["name"]
        this.BirthDate = !IsUndNull(body["BirthDate"]) ? body["BirthDate"] : body["birthdate"]
        this.Email = !IsUndNull(body["Email"]) ? body["Email"] : body["email"]
        this.RecoveryEmail = !IsUndNull(body["RecoveryEmail"]) ? body["RecoveryEmail"] : body["recovery_email"]
        this.Phone = !IsUndNull(body["Phone"]) ? body["Phone"] : body["phone"]
        this.Password = !IsUndNull(body["Password"]) ? body["Password"] : body["password"]
        this.PasswordHint = !IsUndNull(body["PasswordHint"]) ? body["PasswordHint"] : body["password_hint"]
        this.PhotoBase64 = !IsUndNull(body["PhotoBase64"]) ? body["PhotoBase64"] : body["photo_base_64"]
        this.PermissionLevel = this.ConvertEnum(!IsUndNull(body["PermissionLevel"]) ? body["PermissionLevel"] : body["permission_level"], PermissionLevel, "PermissionLevel")
        this.Sex = this.ConvertEnum(!IsUndNull(body["Sex"]) ? body["Sex"] : body["sex"], Sex, "Sex")
        this.EmailAproved = !IsUndNull(body["EmailAproved"]) ? body["EmailAproved"] : body["email_approved"]
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

    private ConvertEnum(prop : any, _enum : any, enumName : string)
    {
        if (prop instanceof Label)
            return prop

        return IsUndNull(prop)
            ? null
            : new Label(_enum, prop, enumName)
    }

    /**
     * Retorna um cópia em modelo SQL do usuário.
     */
    ConvertUserToSqlObject()
    {
        const userInSql : AnySearch = {
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
            "created": this.Created,
            "deleted": this.Deleted
        }

        return userInSql
    }

    EncryptPassword()
    {
        this.Password = EncryptInfo(this.Password)
    }
}

export default User
import Label from "../base/Label"

import EntityRegistry from "../base/EntityRegistry"

import AnySearch from "../../../interfaces/AnySearch"

import EncryptInfo from "../../../functions/security/EncryptPassword"
import FindValue from "../../../functions/logic/FindValue"
import FormatIdNumber from "../../../functions/formatting/FormatIdNumber"
import IsUndNull from "../../../functions/logic/IsUndNull"

import PermissionLevel from "../../../enums/PermissionLevelEnum"
import Sex from "../../../enums/SexEnum"

class User extends EntityRegistry
{
    BirthDate: Date
    Email: string
    EmailAproved : boolean
    ModifiedBy : number
    Name : string
    Password: string
    PasswordHint: string
    PermissionLevel: Label | null
    Phone: string
    PhotoBase64 : string
    RecoveryEmail: string
    Sex: Label | null
    Username: string

    constructor(body : any )
    {
        super(body)
        this.ConvertBody(body)
    }

    ConvertBody(body : any) : void
    {
        this.BirthDate = FindValue(body, ["BirthDate", "birthdate"])
        this.Email = FindValue(body, ["Email", "email"])
        this.EmailAproved = FindValue(body, ["Username", "username"])
        this.Name = FindValue(body, ["Name", "name"])
        this.Password = FindValue(body, ["Password", "password"])
        this.PasswordHint = FindValue(body, ["PasswordHint", "password_hint"])
        this.PermissionLevel = this.ConvertEnum(FindValue(body, ["PermissionLevel", "permission_level"]), PermissionLevel, "PermissionLevel")
        this.Phone = FindValue(body, ["Phone", "phone"])
        this.PhotoBase64 = FindValue(body, ["PhotoBase64", "photo_base_64"])
        this.RecoveryEmail = FindValue(body, ["RecoveryEmail", "recovery_email"])
        this.Sex = this.ConvertEnum(FindValue(body, ["Sex", "sex"]), Sex, "Sex")
        this.Username = FindValue(body, ["Username", "username"])
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
    ConvertToSqlObject()
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
            "deleted": this.Deleted,
            "modified": this.Modified,
            "modified_by": this.ModifiedBy,
        }

        return userInSql
    }

    EncryptPassword()
    {
        this.Password = EncryptInfo(this.Password)
    }
}

export default User
import Label from "../base/Label"

import EntityRegistry from "../base/EntityRegistry"

import EncryptInfo from "../../../functions/security/EncryptPassword"
import FindValue from "../../../functions/logic/FindValue"
import FormatIdNumber from "../../../functions/formatting/FormatIdNumber"
import IsUndNull from "../../../functions/logic/IsUndNull"

import PermissionLevelEnum from "../../../enums/PermissionLevelEnum"
import SexEnum from "../../../enums/SexEnum"

export default class User extends EntityRegistry
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
        this.EmailAproved = FindValue(body, ["EmailAproved", "email_approved"])
        this.ModifiedBy = FindValue(body, ["ModifiedBy", "modified_by"])
        this.Name = FindValue(body, ["Name", "name"])
        this.Password = FindValue(body, ["Password", "password"])
        this.PasswordHint = FindValue(body, ["PasswordHint", "password_hint"])
        this.PermissionLevel = this.ConvertEnum(FindValue(body, ["PermissionLevel", "permission_level"]), PermissionLevelEnum, "PermissionLevel")
        this.Phone = FindValue(body, ["Phone", "phone"])
        this.PhotoBase64 = FindValue(body, ["PhotoBase64", "photo_base_64"])
        this.RecoveryEmail = FindValue(body, ["RecoveryEmail", "recovery_email"])
        this.Sex = this.ConvertEnum(FindValue(body, ["Sex", "sex"]), SexEnum, "Sex")
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

    ConvertToSqlObject()
    {
        return {
            "id": this.Id,
            "active": this.Active,
            "birthdate": this.BirthDate,
            "created": this.Created,
            "deleted": this.Deleted,
            "email_approved" : this.EmailAproved,
            "email": this.Email,
            "modified_by": this.ModifiedBy,
            "modified": this.Modified,
            "name" : this.Name,
            "password_hint": this.PasswordHint,
            "password": this.Password,
            "permission_level": this.PermissionLevel,
            "phone": this.Phone,
            "photo_base_64" : this.PhotoBase64,
            "recovery_email": this.RecoveryEmail,
            "sex": this.Sex,
            "username": this.Username,
        }
    }

    EncryptPassword()
    {
        this.Password = EncryptInfo(this.Password)
    }

    IsAdm() : boolean { return this.PermissionLevel!.Value >= 3 }
}
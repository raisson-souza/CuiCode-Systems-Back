type Option = {
    Id : string
    Description: string
}

type FormProps = {
    FieldId : string
    Name : string
    Type : string
    PlaceHolder? : string
    MaxLen? : number
    Nullable? : boolean
    NeedsSecondConfirmation? : boolean
    Options? : Option[]
}

export type { FormProps }
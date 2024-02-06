interface IPossession
{
    Id : number
    Active : boolean
    Created : Date
    CreatedBy : number
    Modified : Date | null
    ModifiedBy : number | null
}

export default IPossession
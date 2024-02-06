import IPossession from "../../../interfaces/IPossession"

abstract class Possession implements IPossession
{
    Id : number
    Active: boolean
    Created : Date
    CreatedBy : number
    Modified : Date | null
    ModifiedBy : number | null
}

export default Possession
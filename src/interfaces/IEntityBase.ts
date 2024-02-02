interface IEntityBase
{
    Get(db : any, id : any) : any
    Update(db : any, id : any, model : any, modifierId : number) : any
    UpdateByModel(db : any, userId : number, model : any, modifierId : number) : any
    Create(db : any, model : any) : any
}

export default IEntityBase
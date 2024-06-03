import IsNil from "../functions/logic/IsNil"

export default abstract class EntityValidator
{
    static ValidateEntity(entity : any)
    {
        if
        (
            !IsNil(entity.Created) ||
            !IsNil(entity.Modified) ||
            !IsNil(entity.ModifiedBy)
        )
            throw new Error("Uma ou mais propriedades não podem ser editadas.")
    }
}
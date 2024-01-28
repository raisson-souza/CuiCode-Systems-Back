import IsUndNull from "../../../functions/IsUndNull";

abstract class EntityRepository
{
    static ValidateEntity(entity : any)
    {
        if
        (
            !IsUndNull(entity.Created) ||
            !IsUndNull(entity.Modified) ||
            !IsUndNull(entity.ModifiedBy)
        )
            throw new Error("Uma ou mais propriedades não podem ser editadas.")
    }
}

export default EntityRepository
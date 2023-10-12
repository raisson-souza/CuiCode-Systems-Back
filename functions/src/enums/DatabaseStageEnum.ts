enum DatabaseStageEnum
{
    testing = 1,
    staging = 2,
    production = 3
}

function ConvertNumberToDatabaseStageEnum(value : number) : DatabaseStageEnum
{
    switch (value)
    {
        case 1:
            return DatabaseStageEnum.testing
        case 2:
            return DatabaseStageEnum.staging
        case 3:
            return DatabaseStageEnum.production
        default:
            return DatabaseStageEnum.testing
    }
}

export { DatabaseStageEnum, ConvertNumberToDatabaseStageEnum }

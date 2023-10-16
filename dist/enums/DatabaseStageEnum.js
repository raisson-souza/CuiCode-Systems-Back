"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertNumberToDatabaseStageEnum = exports.DatabaseStageEnum = void 0;
var DatabaseStageEnum;
(function (DatabaseStageEnum) {
    DatabaseStageEnum[DatabaseStageEnum["testing"] = 1] = "testing";
    DatabaseStageEnum[DatabaseStageEnum["staging"] = 2] = "staging";
    DatabaseStageEnum[DatabaseStageEnum["production"] = 3] = "production";
})(DatabaseStageEnum || (DatabaseStageEnum = {}));
exports.DatabaseStageEnum = DatabaseStageEnum;
function ConvertNumberToDatabaseStageEnum(value) {
    switch (value) {
        case 1:
            return DatabaseStageEnum.testing;
        case 2:
            return DatabaseStageEnum.staging;
        case 3:
            return DatabaseStageEnum.production;
        default:
            return DatabaseStageEnum.testing;
    }
}
exports.ConvertNumberToDatabaseStageEnum = ConvertNumberToDatabaseStageEnum;
//# sourceMappingURL=DatabaseStageEnum.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Label {
    constructor(enumParam, enumValue, enumName) {
        const decodedEnum = DecodeEnum(enumParam, enumValue, enumName);
        this.Description = decodedEnum.Description,
            this.Value = decodedEnum.Value;
    }
}
exports.default = Label;
function DecodeEnum(enumParam, enumValue, enumName) {
    const chaveEnum = String(enumValue);
    if (enumParam[chaveEnum] !== undefined)
        return {
            Description: String(enumParam[chaveEnum]),
            Value: enumValue
        };
    throw new Error(`Houve um erro ao converter o enumerador ${enumName}. Valor ${enumValue} não existe.`);
}
//# sourceMappingURL=Label.js.map
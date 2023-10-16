"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Label_1 = __importDefault(require("./Label"));
/**
 * Armazena o nome da coluna, o valor da mesma e o tipo.
 * Uso em SQL.
 */
class SqlLabel {
    constructor(columnName, columnValue) {
        columnValue = this.ValidateValue(columnValue);
        this.ColumnName = columnName;
        this.ColumnValue = columnValue;
        this.ColumnType = typeof (columnValue);
    }
    /**
     * Valida e corrige o valor rebido caso seja instância de Label, para o valor da mesma.
     * @param value
     * @returns
     */
    ValidateValue(value) {
        return (value instanceof Label_1.default)
            ? value.Value
            : value;
    }
    /**
     * Converte o valor de um SQL para string em uma query baseado no seu tipo.
     */
    ParsePropNameToSql() {
        switch (this.ColumnType) {
            case "string":
            case "boolean":
                return `'${this.ColumnValue}'`;
            case "number":
                return this.ColumnValue;
            default:
                return `'${this.ColumnValue}'`;
        }
    }
    /**
     * Converte o valor de um SQL para string em uma query baseado no seu tipo.
     */
    static ParsePropNameToSql(valueType, value) {
        switch (valueType) {
            case "string":
            case "boolean":
                return `'${value}'`;
            case "number":
                return value;
            default:
                return `'${value}'`;
        }
    }
}
exports.default = SqlLabel;
//# sourceMappingURL=SqlLabel.js.map
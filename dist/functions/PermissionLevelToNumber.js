"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function PermissionLevelToNumber(permissionLevel) {
    switch (permissionLevel) {
        case "Root":
            return 4;
        case "Adm":
            return 3;
        case "Member":
            return 2;
        case "Guest":
            return 1;
        default:
            return 1;
    }
}
exports.default = PermissionLevelToNumber;
//# sourceMappingURL=PermissionLevelToNumber.js.map
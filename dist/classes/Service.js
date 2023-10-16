"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const QueryUser_1 = __importDefault(require("../services/user/utilities/QueryUser"));
const DatabaseStageEnum_1 = require("../enums/DatabaseStageEnum");
const PermissionLevelEnum_1 = __importDefault(require("../enums/PermissionLevelEnum"));
const IsUndNull_1 = __importDefault(require("../functions/IsUndNull"));
const Responses_1 = __importDefault(require("../functions/Responses"));
const database_config_json_1 = __importDefault(require("../config/database_config.json"));
/**
 * Contains all necessary params for all endpoints
 * @param REQ Request
 * @param RES Response
 * @param DB_stage Database reference
 * @param DB_connection Database connection
 * @param USER_req User Requester
 */
class Service {
    constructor(req, res, db_stage) {
        this.REQ = req;
        this.RES = res;
        this.DB_stage = DatabaseStageEnum_1.DatabaseStageEnum[db_stage];
        this.DB_connection = new pg_1.Client(database_config_json_1.default.DatabaseConfig);
        this.PerformConnection();
    }
    /**
     * Queries all UserReq info
     */
    async SetReqUserAsync() {
        const userReqId = this.CheckUserIdExistance();
        if ((0, IsUndNull_1.default)(userReqId))
            throw new Error("Usuário requeridor não encontrado na requisição.");
        const user = await Promise.resolve((0, QueryUser_1.default)(this.DB_connection, this.DB_stage, userReqId))
            .then(user => {
            return user;
        })
            .catch(ex => {
            throw new Error(ex.message);
        });
        this.USER_req = user;
    }
    CheckUserIdExistance() {
        const userIdInBody = this.CheckUserReqInBody();
        if (!(0, IsUndNull_1.default)(userIdInBody))
            return userIdInBody;
        const userIdInQuery = this.CheckUserReqInQuery();
        if (!(0, IsUndNull_1.default)(userIdInQuery))
            return userIdInQuery;
        return null;
    }
    /**
     * Checks and convert UserReq of query
     */
    CheckUserReqInQuery() {
        const userReqQuery = this.REQ.query.UserReqId;
        if ((0, IsUndNull_1.default)(userReqQuery))
            return null;
        const userReqId = Number.parseInt(userReqQuery);
        return userReqId;
    }
    /**
     * Checks and convert UserReq of body
     */
    CheckUserReqInBody() {
        const userReqId = this.REQ.body.UserReqId;
        if ((0, IsUndNull_1.default)(userReqId))
            return null;
        return userReqId;
    }
    async PerformConnection() {
        await this.DB_connection.connect()
            .then(() => { })
            .catch(ex => {
            Responses_1.default.Error(this.RES, `Houve um erro ao conectar no banco. Erro: ${ex.message}`, "Conexão no banco");
            throw new Error();
        });
    }
    /**
     * @returns User level
     */
    GetReqUserLevel() {
        var _a, _b;
        return !(0, IsUndNull_1.default)(this.USER_req)
            ? PermissionLevelEnum_1.default[(_b = (_a = this.USER_req) === null || _a === void 0 ? void 0 : _a.PermissionLevel) === null || _b === void 0 ? void 0 : _b.Value]
            : null;
    }
    /**
     * @returns User Id, Username, Level and Name
     */
    GetReqUserBasicInfo() {
        var _a, _b, _c, _d, _e;
        return !(0, IsUndNull_1.default)(this.USER_req)
            ? {
                Id: (_a = this.USER_req) === null || _a === void 0 ? void 0 : _a.Id,
                Username: (_b = this.USER_req) === null || _b === void 0 ? void 0 : _b.Username,
                PermissionLevel: (_d = (_c = this.USER_req) === null || _c === void 0 ? void 0 : _c.PermissionLevel) === null || _d === void 0 ? void 0 : _d.Value,
                Name: (_e = this.USER_req) === null || _e === void 0 ? void 0 : _e.Name
            }
            : null;
    }
}
exports.default = Service;
//# sourceMappingURL=Service.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSessionDao = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("../config/config");
const Entities_1 = require("../constant/Entities");
const SessionEntites_1 = require("../entities/SessionEntites");
const UserEntities_1 = require("../entities/UserEntities");
exports.useSessionDao = () => {
    const getSession = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = typeorm_1.getRepository(SessionEntites_1.SessionEntity)
                .createQueryBuilder(Entities_1.Entities.SESSION)
                .leftJoinAndSelect(`${Entities_1.Entities.SESSION}.user`, 'user')
                .where(`${Entities_1.Entities.SESSION}.user_id = :userId`, { userId })
                .getOne();
            return (yield query) || null;
        }
        catch (err) {
            console.log('Error Dao: getSession -> ', err);
            return null;
        }
    });
    const createSession = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield typeorm_1.getRepository(SessionEntites_1.SessionEntity).query(`INSERT INTO ${config_1.ORM_DB_SCHEMA}."${Entities_1.Entities.SESSION}" (expiry_date, user_id) ` + `VALUES ` + `(CURRENT_TIMESTAMP + (${config_1.SESSION_TIMEOUT} || ' minutes')::INTERVAL, '${userId}') `);
            return true;
        }
        catch (err) {
            console.log('Error Dao: createDcSession -> ', err);
            return null;
        }
    });
    const extendSession = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield typeorm_1.getRepository(SessionEntites_1.SessionEntity).query(`UPDATE ${config_1.ORM_DB_SCHEMA}."${Entities_1.Entities.SESSION}" ` + `SET ` + `expiry_date = CURRENT_TIMESTAMP + (${config_1.SESSION_TIMEOUT} || ' minutes')::INTERVAL ` + `WHERE user_id = '${userId}'`);
            return true;
        }
        catch (err) {
            console.log('Error Dao: extendSession -> ', err);
            return false;
        }
    });
    const destroySession = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield typeorm_1.getRepository(SessionEntites_1.SessionEntity).query(`UPDATE ${config_1.ORM_DB_SCHEMA}."${Entities_1.Entities.SESSION}" ` + `SET ` + `expiry_date = NULL ` + `WHERE user_id = '${userId}'`);
            return true;
        }
        catch (err) {
            console.log('Error Dao: destroySession -> ', err);
            return false;
        }
    });
    const verifySession = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = typeorm_1.getRepository(SessionEntites_1.SessionEntity)
                .createQueryBuilder(Entities_1.Entities.SESSION)
                .select()
                .withDeleted()
                .where(`user_id = :userId ` + `AND ` + `expiry_date IS NOT NULL ` + `AND ` + `expiry_date > CURRENT_TIMESTAMP`, { userId })
                .getMany();
            const results = yield query;
            return results.length > 0;
        }
        catch (err) {
            console.log('Error Dao: verifySession -> ', err);
            return false;
        }
    });
    const loginSession = (username) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = typeorm_1.getRepository(UserEntities_1.UserEntity).createQueryBuilder(Entities_1.Entities.USER).select().where(`username = :username `, { username }).getOne();
            return (yield query) || null;
        }
        catch (err) {
            console.log('Error Dao: loginSession -> ', err);
            return null;
        }
    });
    const checkIfSessionExists = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = typeorm_1.getRepository(SessionEntites_1.SessionEntity).createQueryBuilder(Entities_1.Entities.SESSION).select().where(`user_id = :userId `, { userId }).getMany();
            const results = yield query;
            return results.length > 0;
        }
        catch (err) {
            console.log('Error Dao: checkIfSessionExists -> ', err);
            return false;
        }
    });
    return {
        getSession,
        createSession,
        extendSession,
        destroySession,
        verifySession,
        loginSession,
        checkIfSessionExists
    };
};
//# sourceMappingURL=SessionDao.js.map
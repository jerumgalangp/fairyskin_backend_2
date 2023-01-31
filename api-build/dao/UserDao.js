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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserDao = void 0;
const typeorm_1 = require("typeorm");
const winston_logger_1 = __importDefault(require("../common/logger/winston.logger"));
const encryption_1 = require("../constant/encryption");
const HttpConstant_1 = require("../constant/HttpConstant");
const UserEntities_1 = require("../entities/UserEntities");
const ormconfig_1 = require("./../config/ormconfig");
const Entities_1 = require("./../constant/Entities");
const AccessEntities_1 = require("./../entities/AccessEntities");
const CustomerEntities_1 = require("./../entities/CustomerEntities");
const MenuEntities_1 = require("./../entities/MenuEntities");
const RoleEntities_1 = require("./../entities/RoleEntities");
const Schema_1 = require("./../util/Schema");
exports.useUserDao = () => {
    const getUser = (payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            if (!defaultSort.includes('.')) {
                defaultSort = Entities_1.Entities.USER + '.' + defaultSort;
            }
            let query = typeorm_1.getRepository(UserEntities_1.UserEntity).createQueryBuilder(Entities_1.Entities.USER).leftJoinAndSelect(`${Entities_1.Entities.USER}.role`, 'role');
            if (headers.filters !== undefined && ((_a = headers.filters) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                let filters = JSON.parse(headers.filters);
                filters.map((v) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like '%${v.value.toUpperCase()}%' `);
                    }
                    else {
                        query = query.andWhere(`UPPER(${Entities_1.Entities.USER}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
                    }
                });
            }
            if (payload.length > 0) {
                let p = payload[0];
                if (p.type && p.type.value === '%notin%') {
                    query = query.andWhere(`${Entities_1.Entities.USER}.id NOT IN (SELECT user_id FROM ${ormconfig_1.ORM_DB_SCHEMA}.${Entities_1.Entities.CUSTOMER})`);
                }
                else if (p.id && p.id !== undefined) {
                    query = query.andWhere(`${Entities_1.Entities.USER}.id NOT IN ('${p.id}') AND role.recipient = 'Y' `);
                }
            }
            const count = yield query.getCount();
            query
                .skip(pagination.skip)
                .take(pagination.take)
                .orderBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC');
            const results = yield query.getMany();
            const total = count;
            let pageCount = Math.ceil(total / pagination.take) || 1;
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success]), { message: 'Successfully Retrieved data.', results, pagination: { total, current: pagination.current, pageCount } });
        }
        catch (err) {
            winston_logger_1.default.error('Error Dao: Query for getUserDao Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const getUserByID = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let permission = yield typeorm_1.getManager()
                .createQueryBuilder()
                .select('menu_name', 'menu_name')
                .addSelect('role_name', 'role_name')
                .addSelect('role_description', 'role_description')
                .addSelect(`${Entities_1.Entities.MENU}.menu_route`, 'menu_route')
                .from(Schema_1.useSchemaAndTableName(Entities_1.Entities.USER), Entities_1.Entities.USER)
                .leftJoin(RoleEntities_1.RoleEntity, `${Entities_1.Entities.ROLES}`, `${Entities_1.Entities.ROLES}.id = ${Entities_1.Entities.USER}.role_id`)
                .leftJoin(AccessEntities_1.AccessEntity, `${Entities_1.Entities.ACCESS}`, `${Entities_1.Entities.ACCESS}.role_id = ${Entities_1.Entities.ROLES}.id`)
                .leftJoin(MenuEntities_1.MenuEntity, `${Entities_1.Entities.MENU}`, `${Entities_1.Entities.ACCESS}.menu_id = ${Entities_1.Entities.MENU}.id`)
                .where(`${Entities_1.Entities.USER}.id = '${payload[0].id}'`)
                .andWhere(`${Entities_1.Entities.ACCESS}.status = 'Y'`)
                .orderBy(`${Entities_1.Entities.MENU}.order`)
                .getRawMany();
            const results = yield typeorm_1.getRepository(UserEntities_1.UserEntity)
                .createQueryBuilder(Entities_1.Entities.USER)
                .leftJoinAndSelect('tbl_users.role', `${Entities_1.Entities.ROLES}`)
                .where(`tbl_users.id = '${payload[0].id}'`)
                .getMany();
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success]), { message: 'Successfully Retrieved data.', results,
                permission });
        }
        catch (err) {
            winston_logger_1.default.error('Error Dao: Query for getUserDao Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: 'Transaction could not proceed!' });
        }
    });
    const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userExist = yield typeorm_1.getRepository(UserEntities_1.UserEntity).createQueryBuilder(Entities_1.Entities.USER).where(`UPPER(username) = UPPER('${payload.username}')`).getMany();
            if (userExist.length > 0) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `User ${payload.username.toUpperCase()} already exist!` });
            }
            let newpass = yield encryption_1.useHash(payload.password);
            payload.password = newpass;
            const query = typeorm_1.getRepository(UserEntities_1.UserEntity).createQueryBuilder(Entities_1.Entities.USER).insert().into(UserEntities_1.UserEntity).values(payload);
            const data = yield query.execute();
            const { id } = data.identifiers[0];
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Created]), { id, message: 'Successfully created.' });
        }
        catch (err) {
            winston_logger_1.default.error('Error Dao: Create User Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = typeorm_1.getRepository(UserEntities_1.UserEntity).createQueryBuilder(Entities_1.Entities.USER).update(UserEntities_1.UserEntity).set(payload).where('id = :id', { id });
            yield query.execute();
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Updated]), { message: 'Successfully updated.' });
        }
        catch (err) {
            winston_logger_1.default.error('Error Dao: update User -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const resetUserPassword = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let newpass = yield encryption_1.useHash(payload.password);
            payload.password = newpass;
            const query = typeorm_1.getRepository(UserEntities_1.UserEntity).createQueryBuilder(Entities_1.Entities.USER).update(UserEntities_1.UserEntity).set(payload).where('id = :id', { id });
            yield query.execute();
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Reset]), { message: 'Password succesfully updated.' });
        }
        catch (err) {
            winston_logger_1.default.error('Error Dao: update User -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const deleteUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const customerExist = yield typeorm_1.getRepository(CustomerEntities_1.CustomerEntity).createQueryBuilder(Entities_1.Entities.CUSTOMER).where(`user_id = :id`, { id }).getMany();
            if (customerExist.length > 0) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `User is already used and cannot be deleted!` });
            }
            yield typeorm_1.getRepository(UserEntities_1.UserEntity).createQueryBuilder(Entities_1.Entities.USER).update(UserEntities_1.UserEntity).set(payload).where('id = :id', { id }).execute();
            yield typeorm_1.getRepository(UserEntities_1.UserEntity).delete({ id });
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Deleted]), { message: 'Successfully deleted.' });
        }
        catch (err) {
            winston_logger_1.default.error('Error Dao: delete User -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    return {
        getUser,
        getUserByID,
        createUser,
        updateUser,
        resetUserPassword,
        deleteUser
    };
};
//# sourceMappingURL=UserDao.js.map
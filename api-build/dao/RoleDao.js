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
exports.useRoleDao = void 0;
const typeorm_1 = require("typeorm");
const HttpConstant_1 = require("../constant/HttpConstant");
const Entities_1 = require("./../constant/Entities");
const AccessEntities_1 = require("./../entities/AccessEntities");
const MenuEntities_1 = require("./../entities/MenuEntities");
const RoleEntities_1 = require("./../entities/RoleEntities");
const UserEntities_1 = require("./../entities/UserEntities");
exports.useRoleDao = () => {
    const getAllRole = (_payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            if (!defaultSort.includes('.')) {
                defaultSort = Entities_1.Entities.ROLES + '.' + defaultSort;
            }
            let query = typeorm_1.getRepository(RoleEntities_1.RoleEntity).createQueryBuilder(Entities_1.Entities.ROLES);
            if (headers.filters !== undefined && ((_a = headers.filters) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                let filters = JSON.parse(headers.filters);
                filters.map((v) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like :q`, { q: `%${v.value.toUpperCase()}%` });
                    }
                    else {
                        query = query.andWhere(`UPPER(${Entities_1.Entities.ROLES}.${v.id}) Like :q`, { q: `%${v.value.toUpperCase()}%` });
                    }
                });
            }
            const count = yield query.getCount();
            query.orderBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC');
            const results = yield query.getMany();
            const total = count;
            let pageCount = Math.ceil(total / pagination.take) || 1;
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success]), { message: 'Successfully Retrieved data.', results, pagination: { total, current: pagination.current, pageCount } });
        }
        catch (err) {
            console.log('Error Dao: Query for getRoleDao Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const getRole = (_payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            if (!defaultSort.includes('.')) {
                defaultSort = Entities_1.Entities.ROLES + '.' + defaultSort;
            }
            let query = typeorm_1.getRepository(RoleEntities_1.RoleEntity).createQueryBuilder(Entities_1.Entities.ROLES);
            if (headers.filters !== undefined && ((_b = headers.filters) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                let filters = JSON.parse(headers.filters);
                filters.map((v) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like '%${v.value.toUpperCase()}%' `);
                    }
                    else {
                        query = query.andWhere(`UPPER(${Entities_1.Entities.ROLES}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
                    }
                });
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
            console.log('Error Dao: Query for getRoleDao Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const createRole = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let role_id;
            const userExist = yield typeorm_1.getRepository(RoleEntities_1.RoleEntity).createQueryBuilder(Entities_1.Entities.ROLES).where(`UPPER(role_name) = UPPER('${payload.role_name}')`).getMany();
            if (userExist.length > 0) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `User ${payload.role_name.toUpperCase()} already exist!` });
            }
            const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const data = yield transactionEntityManager.getRepository(RoleEntities_1.RoleEntity).createQueryBuilder(Entities_1.Entities.ROLES).insert().into(RoleEntities_1.RoleEntity).values(payload).execute();
                    let { id } = data.identifiers[0];
                    role_id = id;
                    let menu_id = yield transactionEntityManager.getRepository(MenuEntities_1.MenuEntity).createQueryBuilder(Entities_1.Entities.MENU).select('id').execute();
                    menu_id.map((id) => __awaiter(void 0, void 0, void 0, function* () {
                        yield transactionEntityManager
                            .getRepository(AccessEntities_1.AccessEntity)
                            .createQueryBuilder(Entities_1.Entities.ACCESS)
                            .insert()
                            .into(AccessEntities_1.AccessEntity)
                            .values({ role_id: role_id, menu_id: id.id, status: 'N' })
                            .execute();
                    }));
                    return true;
                }
                catch (err) {
                    console.log('Error Dao: Deleting ewt Dao Transaction -> ', err);
                    return false;
                }
            }));
            if (transaction) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Created]), { role_id, message: 'Successfully created.' });
            }
            else {
                console.log('Error Dao: Create Role Transaction -> ', 'Error Creating Role!');
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: 'Error Creating Role!' });
            }
        }
        catch (err) {
            console.log('Error Dao: Create Role Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const updateRole = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = typeorm_1.getRepository(RoleEntities_1.RoleEntity).createQueryBuilder(Entities_1.Entities.ROLES).update(RoleEntities_1.RoleEntity).set(payload).where('id = :id', { id });
            yield query.execute();
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Updated]), { message: 'Successfully updated.' });
        }
        catch (err) {
            console.log('Error Dao: update Role -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const deleteRole = (id, _payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userExist = yield typeorm_1.getRepository(UserEntities_1.UserEntity).createQueryBuilder(Entities_1.Entities.USER).where({ role_id: id }).getMany();
            if (userExist.length > 0) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `Role is already used and cannot be deleted!` });
            }
            const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield transactionEntityManager.getRepository(AccessEntities_1.AccessEntity).createQueryBuilder(Entities_1.Entities.ACCESS).delete().where({ role_id: id }).execute();
                    yield transactionEntityManager.getRepository(RoleEntities_1.RoleEntity).delete({ id });
                    return true;
                }
                catch (err) {
                    console.log('Error Dao: Deleting ewt Dao Transaction -> ', err);
                    return false;
                }
            }));
            if (transaction) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Deleted]), { message: 'Successfully deleted.' });
            }
            else {
                console.log('Error Dao: Deleting Role Transaction -> ', 'Error Deleting Role!');
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: 'Error Deleting Role!' });
            }
        }
        catch (err) {
            console.log('Error Dao: delete Role -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const restoreRole = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield typeorm_1.getRepository(RoleEntities_1.RoleEntity)
                .createQueryBuilder(Entities_1.Entities.ROLES)
                .update(RoleEntities_1.RoleEntity)
                .set(Object.assign(Object.assign({}, payload), { updated_at: new Date() }))
                .where('id = :id', { id })
                .execute();
            yield typeorm_1.getRepository(RoleEntities_1.RoleEntity).restore({ id });
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Restored]), { message: 'Successfully restored.' });
        }
        catch (err) {
            console.log('Error Dao: restoreRole -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    return {
        getAllRole,
        getRole,
        createRole,
        updateRole,
        deleteRole,
        restoreRole
    };
};
//# sourceMappingURL=RoleDao.js.map
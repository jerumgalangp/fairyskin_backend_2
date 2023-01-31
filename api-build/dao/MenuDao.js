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
exports.useMenuDao = void 0;
const typeorm_1 = require("typeorm");
const HttpConstant_1 = require("../constant/HttpConstant");
const Entities_1 = require("./../constant/Entities");
const AccessEntities_1 = require("./../entities/AccessEntities");
const MenuEntities_1 = require("./../entities/MenuEntities");
const ConnectionManager_1 = require("./../util/ConnectionManager");
const Schema_1 = require("./../util/Schema");
exports.useMenuDao = () => {
    const getAllMenu = (_payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            if (!defaultSort.includes('.')) {
                defaultSort = Entities_1.Entities.MENU + '.' + defaultSort;
            }
            let query = typeorm_1.getRepository(MenuEntities_1.MenuEntity).createQueryBuilder(Entities_1.Entities.MENU);
            if (headers.filters !== undefined && ((_a = headers.filters) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                let filters = JSON.parse(headers.filters);
                filters.map((v) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like :q`, { q: `%${v.value.toUpperCase()}%` });
                    }
                    else {
                        query = query.andWhere(`UPPER(${Entities_1.Entities.MENU}.${v.id}) Like :q`, { q: `%${v.value.toUpperCase()}%` });
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
            console.log('Error Dao: Query for getMenuDao Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const getMenu = (payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            let defaultSort = 'order';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            if (!defaultSort.includes('.')) {
                defaultSort = Entities_1.Entities.MENU + '.' + defaultSort;
            }
            let where = '';
            if (headers.filters !== undefined && ((_b = headers.filters) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                let filters = JSON.parse(headers.filters);
                filters.map((v) => {
                    let c = Entities_1.Entities.MENU;
                    if (v.id === 'status') {
                        c = Entities_1.Entities.ACCESS;
                    }
                    where = `AND UPPER(${c}.${v.id}) Like UPPER('%${v.value}%')`;
                });
            }
            const joinTable = Schema_1.useSchemaAndTableName(Entities_1.Entities.ACCESS);
            const mainTable = Schema_1.useSchemaAndTableName(Entities_1.Entities.MENU);
            let { queryResults: results } = yield ConnectionManager_1.useConnectionManager({
                query: `
                    SELECT 
                        ${Entities_1.Entities.MENU}.ID, MENU_NAME,   ${Entities_1.Entities.MENU}.ORDER, ${Entities_1.Entities.ACCESS}.STATUS
                    FROM 
                        ` +
                    `${mainTable}` +
                    ` ${Entities_1.Entities.MENU} 
                    LEFT JOIN 
                        ` +
                    `${joinTable}` +
                    ` ${Entities_1.Entities.ACCESS} 
                    ON ${Entities_1.Entities.MENU} .ID = ${Entities_1.Entities.ACCESS}.MENU_ID
                    WHERE 
                    ${Entities_1.Entities.ACCESS}.ROLE_ID  = $1
                    ${where}
                    ORDER BY ${defaultSort} ${headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'ASC'} `,
                parameters: [payload.role_id]
            });
            const total = results.length;
            let pageCount = Math.ceil(total / pagination.take) || 1;
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success]), { message: 'Successfully Retrieved data.', results, pagination: { total, current: pagination.current, pageCount } });
        }
        catch (err) {
            console.log('Error Dao: Query for getMenuDao Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const createMenu = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userExist = yield typeorm_1.getRepository(MenuEntities_1.MenuEntity).createQueryBuilder(Entities_1.Entities.MENU).where(`UPPER(menu_name) = UPPER('${payload.menu_name}')`).getMany();
            if (userExist.length > 0) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `User ${payload.menu_name.toUpperCase()} already exist!` });
            }
            const query = typeorm_1.getRepository(MenuEntities_1.MenuEntity).createQueryBuilder(Entities_1.Entities.MENU).insert().into(MenuEntities_1.MenuEntity).values(payload);
            const data = yield query.execute();
            const { id } = data.identifiers[0];
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Created]), { id, message: 'Successfully created.' });
        }
        catch (err) {
            console.log('Error Dao: Create Menu Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const updateMenu = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                var _c;
                try {
                    (_c = payload.menu_name) === null || _c === void 0 ? void 0 : _c.map((v) => __awaiter(void 0, void 0, void 0, function* () {
                        yield transactionEntityManager
                            .getRepository(AccessEntities_1.AccessEntity)
                            .createQueryBuilder(Entities_1.Entities.ACCESS)
                            .update(AccessEntities_1.AccessEntity)
                            .set({
                            status: v.status,
                            updated_by: payload.updated_by,
                            updated_at: new Date()
                        })
                            .where('role_id = :role_id', { role_id: id })
                            .andWhere('menu_id = :menu_id', { menu_id: v.id })
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
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Updated]), { message: 'Successfully updated.' });
            }
            else {
                console.log('Error Dao: Create Role Transaction -> ', 'Error Creating Role!');
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: 'Error Creating Role!' });
            }
        }
        catch (err) {
            console.log('Error Dao: update Menu -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const deleteMenu = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield typeorm_1.getRepository(MenuEntities_1.MenuEntity).createQueryBuilder(Entities_1.Entities.MENU).update(MenuEntities_1.MenuEntity).set(payload).where('id = :id', { id }).execute();
            yield typeorm_1.getRepository(MenuEntities_1.MenuEntity).delete({ id });
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Deleted]), { message: 'Successfully deleted.' });
        }
        catch (err) {
            console.log('Error Dao: delete Menu -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const restoreMenu = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield typeorm_1.getRepository(MenuEntities_1.MenuEntity)
                .createQueryBuilder(Entities_1.Entities.MENU)
                .update(MenuEntities_1.MenuEntity)
                .set(Object.assign(Object.assign({}, payload), { updated_at: new Date() }))
                .where('id = :id', { id })
                .execute();
            yield typeorm_1.getRepository(MenuEntities_1.MenuEntity).restore({ id });
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Restored]), { message: 'Successfully restored.' });
        }
        catch (err) {
            console.log('Error Dao: restoreMenu -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    return {
        getAllMenu,
        getMenu,
        createMenu,
        updateMenu,
        deleteMenu,
        restoreMenu
    };
};
//# sourceMappingURL=MenuDao.js.map
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
exports.useAreaDao = void 0;
const typeorm_1 = require("typeorm");
const HttpConstant_1 = require("../constant/HttpConstant");
const Entities_1 = require("./../constant/Entities");
const AreaEntities_1 = require("./../entities/AreaEntities");
exports.useAreaDao = () => {
    const getAllArea = (_payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            if (!defaultSort.includes('.')) {
                defaultSort = Entities_1.Entities.AREA + '.' + defaultSort;
            }
            let query = typeorm_1.getRepository(AreaEntities_1.AreaEntity).createQueryBuilder(Entities_1.Entities.AREA);
            if (headers.filters !== undefined && ((_a = headers.filters) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                let filters = JSON.parse(headers.filters);
                filters.map((v) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like :q`, { q: `%${v.value.toUpperCase()}%` });
                    }
                    else {
                        query = query.andWhere(`UPPER(${Entities_1.Entities.AREA}.${v.id}) Like :q`, { q: `%${v.value.toUpperCase()}%` });
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
            console.log('Error Dao: Query for getAreaDao Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const getArea = (_payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            if (!defaultSort.includes('.')) {
                defaultSort = Entities_1.Entities.AREA + '.' + defaultSort;
            }
            let query = typeorm_1.getRepository(AreaEntities_1.AreaEntity).createQueryBuilder(Entities_1.Entities.AREA);
            if (headers.filters !== undefined && ((_b = headers.filters) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                let filters = JSON.parse(headers.filters);
                filters.map((v) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like '%${v.value.toUpperCase()}%' `);
                    }
                    else {
                        query = query.andWhere(`UPPER(${Entities_1.Entities.AREA}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
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
            console.log('Error Dao: Query for getAreaDao Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const createArea = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let Area_id;
            const userExist = yield typeorm_1.getRepository(AreaEntities_1.AreaEntity).createQueryBuilder(Entities_1.Entities.AREA).where(`UPPER(Area_name) = UPPER('${payload.area_name}')`).getMany();
            if (userExist.length > 0) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `User ${payload.area_name.toUpperCase()} already exist!` });
            }
            const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const data = yield transactionEntityManager.getRepository(AreaEntities_1.AreaEntity).createQueryBuilder(Entities_1.Entities.AREA).insert().into(AreaEntities_1.AreaEntity).values(payload).execute();
                    let { id } = data.identifiers[0];
                    Area_id = id;
                    return true;
                }
                catch (err) {
                    console.log('Error Dao: Deleting Area Dao Transaction -> ', err);
                    return false;
                }
            }));
            if (transaction) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Created]), { Area_id, message: 'Successfully created.' });
            }
            else {
                console.log('Error Dao: Create Area Transaction -> ', 'Error Creating Area!');
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: 'Error Creating Area!' });
            }
        }
        catch (err) {
            console.log('Error Dao: Create Area Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const updateArea = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = typeorm_1.getRepository(AreaEntities_1.AreaEntity).createQueryBuilder(Entities_1.Entities.AREA).update(AreaEntities_1.AreaEntity).set(payload).where('id = :id', { id });
            yield query.execute();
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Updated]), { message: 'Successfully updated.' });
        }
        catch (err) {
            console.log('Error Dao: update Area -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const deleteArea = (id, _payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield typeorm_1.getRepository(AreaEntities_1.AreaEntity).delete({ id });
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Deleted]), { message: 'Successfully deleted.' });
        }
        catch (err) {
            console.log('Error Dao: delete Area -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const restoreArea = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield typeorm_1.getRepository(AreaEntities_1.AreaEntity)
                .createQueryBuilder(Entities_1.Entities.AREA)
                .update(AreaEntities_1.AreaEntity)
                .set(Object.assign(Object.assign({}, payload), { updated_at: new Date() }))
                .where('id = :id', { id })
                .execute();
            yield typeorm_1.getRepository(AreaEntities_1.AreaEntity).restore({ id });
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Restored]), { message: 'Successfully restored.' });
        }
        catch (err) {
            console.log('Error Dao: restoreArea -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    return {
        getAllArea,
        getArea,
        createArea,
        updateArea,
        deleteArea,
        restoreArea
    };
};
//# sourceMappingURL=AreaDao.js.map
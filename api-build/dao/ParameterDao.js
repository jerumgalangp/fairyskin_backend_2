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
exports.useParameterDao = void 0;
const typeorm_1 = require("typeorm");
const HttpConstant_1 = require("../constant/HttpConstant");
const Entities_1 = require("./../constant/Entities");
const ParameterEntities_1 = require("./../entities/ParameterEntities");
exports.useParameterDao = () => {
    const getParameter = (payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            let queries = {
                withDeleted: headers.withdeleted === 'true',
                order: { [defaultSort]: headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC', parameter_name: 'ASC', parameter_value: 'DESC' },
                skip: pagination.skip,
                take: pagination.take
            };
            if (payload.length > 0)
                queries = Object.assign(Object.assign({}, queries), { where: payload });
            const results = yield ParameterEntities_1.ParameterEntity.find(queries);
            const total = yield ParameterEntities_1.ParameterEntity.count(queries);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success]), { message: 'Successfully Retrieved data.', results, pagination: { total, current: pagination.current } });
        }
        catch (err) {
            console.log('Error Dao: Query for getParameterDao Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const createParameter = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const paramExist = yield typeorm_1.getRepository(ParameterEntities_1.ParameterEntity)
                .createQueryBuilder(Entities_1.Entities.PARAMETER)
                .where('parameter_type = :paramter_type AND parameter_value = :parameter_value', { paramter_type: payload.parameter_type, parameter_value: payload.parameter_value })
                .getMany();
            if (paramExist.length > 0) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `Parameter ${payload.parameter_type.toUpperCase()} already exist!` });
            }
            const query = typeorm_1.getRepository(ParameterEntities_1.ParameterEntity).createQueryBuilder(Entities_1.Entities.PARAMETER).insert().into(ParameterEntities_1.ParameterEntity).values(payload);
            const data = yield query.execute();
            const { id } = data.identifiers[0];
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Created]), { id, message: 'Successfully created.' });
        }
        catch (err) {
            console.log('Error Dao: Create Parameter Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const updateParameter = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = typeorm_1.getRepository(ParameterEntities_1.ParameterEntity).createQueryBuilder(Entities_1.Entities.PARAMETER).update(ParameterEntities_1.ParameterEntity).set(payload).where('id = :id', { id });
            yield query.execute();
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Updated]), { message: 'Successfully updated.' });
        }
        catch (err) {
            console.log('Error Dao: update Parameter -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const deleteParameter = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield typeorm_1.getRepository(ParameterEntities_1.ParameterEntity).createQueryBuilder(Entities_1.Entities.PARAMETER).update(ParameterEntities_1.ParameterEntity).set(payload).where('id = :id', { id }).execute();
            yield typeorm_1.getRepository(ParameterEntities_1.ParameterEntity).delete({ id });
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Deleted]), { message: 'Successfully deleted.' });
        }
        catch (err) {
            console.log('Error Dao: delete Parameter -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const restoreParameter = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield typeorm_1.getRepository(ParameterEntities_1.ParameterEntity)
                .createQueryBuilder(Entities_1.Entities.PARAMETER)
                .update(ParameterEntities_1.ParameterEntity)
                .set(Object.assign(Object.assign({}, payload), { updated_at: new Date() }))
                .where('id = :id', { id })
                .execute();
            yield typeorm_1.getRepository(ParameterEntities_1.ParameterEntity).restore({ id });
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Restored]), { message: 'Successfully restored.' });
        }
        catch (err) {
            console.log('Error Dao: restoreParameter -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    return {
        getParameter,
        createParameter,
        updateParameter,
        deleteParameter,
        restoreParameter
    };
};
//# sourceMappingURL=ParameterDao.js.map
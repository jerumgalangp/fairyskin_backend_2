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
exports.useCustomerDao = void 0;
const typeorm_1 = require("typeorm");
const winston_logger_1 = __importDefault(require("../common/logger/winston.logger"));
const HttpConstant_1 = require("../constant/HttpConstant");
const Entities_1 = require("./../constant/Entities");
const CustomerEntities_1 = require("./../entities/CustomerEntities");
const RoleEntities_1 = require("./../entities/RoleEntities");
exports.useCustomerDao = () => {
    const getCustomer = (payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            if (!defaultSort.includes('.')) {
                defaultSort = Entities_1.Entities.CUSTOMER + '.' + defaultSort;
            }
            let where = '';
            if (payload.length > 0) {
                if (payload[0].all_available && payload[0].all_available !== undefined) {
                    where = `(customer_status = '' OR customer_status is null OR Upper(customer_status) like '%DELIVER%')`;
                }
                else if (payload[0].id && payload[0].id !== undefined) {
                    where = `user_id not in ('${payload[0].id}')`;
                }
            }
            let query = typeorm_1.getRepository(CustomerEntities_1.CustomerEntity)
                .createQueryBuilder(Entities_1.Entities.CUSTOMER)
                .leftJoinAndSelect(`${Entities_1.Entities.CUSTOMER}.user`, 'user')
                .leftJoinAndSelect(`${Entities_1.Entities.CUSTOMER}.customer_orders`, `${Entities_1.Entities.ORDER}`)
                .leftJoinAndSelect(`${Entities_1.Entities.CUSTOMER}.area`, `${Entities_1.Entities.AREA}`)
                .leftJoinAndMapOne(`user.role`, RoleEntities_1.RoleEntity, 'role', 'user.role_id = role.id')
                .where(where);
            if (headers.filters !== undefined && ((_a = headers.filters) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                let filters = JSON.parse(headers.filters);
                filters.map((v) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        if (f[0] === 'area') {
                            query = query.andWhere(`UPPER(${Entities_1.Entities.AREA}.${f[1]}) Like '%${v.value.toUpperCase()}%' `);
                        }
                        else
                            query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like '%${v.value.toUpperCase()}%' `);
                    }
                    else {
                        query = query.andWhere(`UPPER(${Entities_1.Entities.CUSTOMER}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
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
            winston_logger_1.default.error('Error Dao: Query for getCustomer Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const createCustomer = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = typeorm_1.getRepository(CustomerEntities_1.CustomerEntity).createQueryBuilder(Entities_1.Entities.CUSTOMER).insert().into(CustomerEntities_1.CustomerEntity).values(payload);
            const data = yield query.execute();
            const { id } = data.identifiers[0];
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Created]), { id, message: 'Successfully created.' });
        }
        catch (err) {
            console.log('Error Dao: Create Customer Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const updateCustomer = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = typeorm_1.getRepository(CustomerEntities_1.CustomerEntity).createQueryBuilder(Entities_1.Entities.CUSTOMER).update(CustomerEntities_1.CustomerEntity).set(payload).where('id = :id', { id });
            yield query.execute();
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Updated]), { message: 'Successfully updated.' });
        }
        catch (err) {
            console.log('Error Dao: update Customer -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const deleteCustomer = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield typeorm_1.getRepository(CustomerEntities_1.CustomerEntity).createQueryBuilder(Entities_1.Entities.CUSTOMER).update(CustomerEntities_1.CustomerEntity).set(payload).where('id = :id', { id }).execute();
            yield typeorm_1.getRepository(CustomerEntities_1.CustomerEntity).delete({ id });
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Deleted]), { message: 'Successfully deleted.' });
        }
        catch (err) {
            console.log('Error Dao: delete Customer -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const restoreCustomer = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield typeorm_1.getRepository(CustomerEntities_1.CustomerEntity)
                .createQueryBuilder(Entities_1.Entities.CUSTOMER)
                .update(CustomerEntities_1.CustomerEntity)
                .set(Object.assign(Object.assign({}, payload), { updated_at: new Date() }))
                .where('id = :id', { id })
                .execute();
            yield typeorm_1.getRepository(CustomerEntities_1.CustomerEntity).restore({ id });
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Restored]), { message: 'Successfully restored.' });
        }
        catch (err) {
            console.log('Error Dao: restoreCustomer -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    return {
        getCustomer,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        restoreCustomer
    };
};
//# sourceMappingURL=CustomerDao.js.map
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
exports.useReportDao = void 0;
const typeorm_1 = require("typeorm");
const HttpConstant_1 = require("../constant/HttpConstant");
const Entities_1 = require("./../constant/Entities");
const AreaEntities_1 = require("./../entities/AreaEntities");
const CustomerEntities_1 = require("./../entities/CustomerEntities");
const OrderEntities_1 = require("./../entities/OrderEntities");
const ProductEntities_1 = require("./../entities/ProductEntities");
const Schema_1 = require("./../util/Schema");
exports.useReportDao = () => {
    const getQSPR = (payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            let defaultSort = 'area_name';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            if (!defaultSort.includes('.')) {
                defaultSort = Entities_1.Entities.AREA + '.' + defaultSort;
            }
            let where = '';
            if (payload.length > 0) {
                let date_from = payload[0];
                let date_to = payload[1];
                where = `DATE(${Entities_1.Entities.ORDER}.CREATED_AT) BETWEEN DATE('${date_from.df._value}') AND DATE('${date_to.dt._value}')`;
            }
            let query = typeorm_1.getManager()
                .createQueryBuilder()
                .select('area_name', 'region')
                .addSelect(`${Entities_1.Entities.PRODUCTS}.product_name`, 'product')
                .addSelect(`SUM(${Entities_1.Entities.ORDER_PRODUCTS}.quantity)`, 'quantity_sold')
                .addSelect(`SUM(${Entities_1.Entities.ORDER_PRODUCTS}.total)`, 'total')
                .from(Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER_PRODUCTS), Entities_1.Entities.ORDER_PRODUCTS)
                .leftJoin(OrderEntities_1.OrderEntity, `${Entities_1.Entities.ORDER}`, `${Entities_1.Entities.ORDER}.id = ${Entities_1.Entities.ORDER_PRODUCTS}."orderId"`)
                .leftJoin(CustomerEntities_1.CustomerEntity, `${Entities_1.Entities.CUSTOMER}`, `${Entities_1.Entities.CUSTOMER}.id = ${Entities_1.Entities.ORDER}.customer_id`)
                .leftJoin(AreaEntities_1.AreaEntity, `${Entities_1.Entities.AREA}`, `${Entities_1.Entities.AREA}.id = ${Entities_1.Entities.CUSTOMER}.customer_area`)
                .leftJoin(ProductEntities_1.ProductsEntity, `${Entities_1.Entities.PRODUCTS}`, `${Entities_1.Entities.PRODUCTS}.id = ${Entities_1.Entities.ORDER_PRODUCTS}."productId"`)
                .where(where)
                .groupBy(`area_name`)
                .addGroupBy(`${Entities_1.Entities.ORDER_PRODUCTS}."productId"`)
                .addGroupBy(`${Entities_1.Entities.PRODUCTS}.product_name`);
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
            if (headers.filters !== undefined && ((_b = headers.filters) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                let filters = JSON.parse(headers.filters);
                filters.map((v) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        let filter0 = f[0];
                        let filter1 = f[1];
                        query = query.andWhere(`UPPER(${filter0}.${filter1}) Like '%${v.value.toUpperCase()}%' `);
                    }
                    else {
                        let w = `${Entities_1.Entities.ORDER}.${v.id}`;
                        if (v.id === 'name') {
                            w = `${Entities_1.Entities.USER}.${v.id}`;
                        }
                        query = query.andWhere(`UPPER(${w}) Like '%${v.value.toUpperCase()}%' `);
                    }
                });
            }
            const count = yield query.getCount();
            query
                .offset(pagination.skip)
                .limit(pagination.take)
                .orderBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC');
            const results = yield query.getRawMany();
            const total = count;
            let pageCount = Math.ceil(total / pagination.take) || 1;
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success]), { message: 'Successfully Retrieved data.', results, pagination: { total, current: pagination.current, pageCount } });
        }
        catch (err) {
            console.log('Error Dao: Query for getAreaDao Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const getTSPR = (_payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            if (!defaultSort.includes('.')) {
                defaultSort = Entities_1.Entities.AREA + '.' + defaultSort;
            }
            let query = typeorm_1.getRepository(AreaEntities_1.AreaEntity).createQueryBuilder(Entities_1.Entities.AREA);
            if (headers.filters !== undefined && ((_c = headers.filters) === null || _c === void 0 ? void 0 : _c.length) > 0) {
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
    const getPPR = (_payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        var _d;
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            if (!defaultSort.includes('.')) {
                defaultSort = Entities_1.Entities.AREA + '.' + defaultSort;
            }
            let query = typeorm_1.getRepository(AreaEntities_1.AreaEntity).createQueryBuilder(Entities_1.Entities.AREA);
            if (headers.filters !== undefined && ((_d = headers.filters) === null || _d === void 0 ? void 0 : _d.length) > 0) {
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
    return {
        getQSPR,
        getTSPR,
        getPPR
    };
};
//# sourceMappingURL=ReportDao.js.map
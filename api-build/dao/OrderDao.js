'use strict';
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
exports.useOrderDao = void 0;
const moment_1 = __importDefault(require('moment'));
const OrderDeliveredEntities_1 = require('./../entities/OrderDeliveredEntities');
const OrderDeliveredPendingEntities_1 = require('./../entities/OrderDeliveredPendingEntities');
const OrderPendingEntities_1 = require('./../entities/OrderPendingEntities');
const ProductEntities_1 = require('./../entities/ProductEntities');
const CustomerEntities_1 = require('./../entities/CustomerEntities');
const RoleEntities_1 = require('./../entities/RoleEntities');
const UserEntities_1 = require('./../entities/UserEntities');
const Schema_1 = require('./../util/Schema');
const typeorm_1 = require('typeorm');
const HttpConstant_1 = require('../constant/HttpConstant');
const Entities_1 = require('./../constant/Entities');
const OrderEntities_1 = require('./../entities/OrderEntities');
const OrderProductEntities_1 = require('./../entities/OrderProductEntities');
exports.useOrderDao = () => {
    const getOrder = (payload, pagination, headers) =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            try {
                let defaultSort = Entities_1.Entities.ORDER + '.' + 'created_at';
                if (headers.sort_by !== undefined) defaultSort = headers.sort_by;
                let where = '';
                if (payload.length > 0) {
                    if (payload[0].order_status.indexOf('|') > -1) {
                        let p = payload[0].order_status.split('|');

                        let whereIn = '';
                        for (let i = 0; i < p.length; i++) {
                            whereIn += `'${p[i]}'`;

                            if (i + 1 !== p.length) whereIn += ',';
                        }

                        where = `order_status in (${whereIn})`;
                    } else where = `Upper(order_status) = Upper('${payload[0].order_status}')`;
                }
                const o = Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER);
                const op = Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER_PRODUCTS);
                const totalOrders = typeorm_1
                    .getManager()
                    .createQueryBuilder()
                    .select('"orderId"', 'orderId')
                    .addSelect('SUM(quantity)', 'quantity')
                    .from(op, Entities_1.Entities.ORDER_PRODUCTS)
                    .groupBy('"orderId"');
                let query = typeorm_1
                    .getManager()
                    .createQueryBuilder()
                    .select(`${Entities_1.Entities.ORDER}.id`, 'id')
                    .addSelect('si_number', 'si_number')
                    .addSelect('total_orders.quantity', 'quantity')
                    .addSelect('amount_to_pay', 'amount_to_pay')
                    .addSelect('amount_to_pay', 'total')
                    .addSelect('order_status', 'order_status')
                    .addSelect('payment_remarks', 'payment_remarks')
                    .addSelect('payment_status', 'payment_status')
                    .addSelect('order_date', 'order_date')
                    .addSelect('order_remarks', 'order_remarks')
                    .addSelect('reference_value', 'reference_value')
                    .addSelect('approval_ind', 'approval_ind')
                    .addSelect(`customer_id`, 'customer_id')
                    .addSelect(`${Entities_1.Entities.USER}.name`, 'name')
                    .addSelect(`${Entities_1.Entities.USER}.contact_number`, 'contact_number')
                    .addSelect(`${Entities_1.Entities.USER}.address`, 'address')
                    .addSelect(`${Entities_1.Entities.ROLES}.role_description`, 'role')
                    .addSelect(`${Entities_1.Entities.CUSTOMER}.customer_over_payment`, 'over_payment')
                    .from(o, Entities_1.Entities.ORDER)
                    .leftJoin('(' + totalOrders.getQuery() + ')', 'total_orders', `total_orders."orderId" = ${Entities_1.Entities.ORDER}.id`)
                    .leftJoin(CustomerEntities_1.CustomerEntity, `${Entities_1.Entities.CUSTOMER}`, `${Entities_1.Entities.CUSTOMER}.id = ${Entities_1.Entities.ORDER}.customer_id`)
                    .leftJoin(UserEntities_1.UserEntity, `${Entities_1.Entities.USER}`, `${Entities_1.Entities.USER}.id = ${Entities_1.Entities.CUSTOMER}.user_id`)
                    .leftJoin(RoleEntities_1.RoleEntity, `${Entities_1.Entities.ROLES}`, `${Entities_1.Entities.ROLES}.id = ${Entities_1.Entities.USER}.role_id`)
                    .where(where);
                if (headers.filters !== undefined && ((_a = headers.filters) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    let filters = JSON.parse(headers.filters);
                    filters.map((v) => {
                        if (v.id.includes('.')) {
                            let f = v.id.split('.');
                            let filter0 = f[0];
                            let filter1 = f[1];
                            query = query.andWhere(`UPPER(${filter0}.${filter1}) Like '%${v.value.toUpperCase()}%' `);
                        } else {
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
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success]), {
                    message: 'Successfully Retrieved data.',
                    results,
                    pagination: { total, current: pagination.current, pageCount }
                });
            } catch (err) {
                console.log('Error Dao: Query for getOrderDao Transaction -> ', err);
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
            }
        });
    const getOrderDelivery = (payload, pagination, headers) =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            try {
                let defaultSort = Entities_1.Entities.ORDER + '.' + 'created_at';
                if (headers.sort_by !== undefined) defaultSort = headers.sort_by;
                let where = '';
                if (payload.length > 0) {
                    let date_from = payload[1];
                    let date_to = payload[2];
                    if (payload[0].order_status.indexOf('|') > -1) {
                        let p = payload[0].order_status.split('|');
                        let whereIn = '';
                        for (let i = 0; i < p.length; i++) {
                            whereIn += `'${p[i]}'`;

                            if (i + 1 !== p.length) whereIn += ',';
                        }

                        where = `order_status in (${whereIn})`;
                        if (date_from !== undefined && date_to !== undefined) {
                            where = `order_status in (${whereIn}) and DATE(${Entities_1.Entities.ORDER}.CREATED_AT) BETWEEN DATE('${date_from.df._value}') AND DATE('${date_to.dt._value}')`;
                        }
                    } else where = `Upper(order_status) = Upper('${payload[0].order_status}')`;
                }
                const o = Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER);
                const op = Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER_PRODUCTS);
                const od = Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER_DELIVERED);
                const totalOrders = typeorm_1
                    .getManager()
                    .createQueryBuilder()
                    .select('"orderId"', 'orderId')
                    .addSelect('SUM(quantity)', 'quantity')
                    .from(op, Entities_1.Entities.ORDER_PRODUCTS)
                    .groupBy('"orderId"');
                const totalOrdersDelivered = typeorm_1
                    .getManager()
                    .createQueryBuilder()
                    .select('"orderId"', 'orderId')
                    .addSelect('delivered_date', 'delivered_date')
                    .addSelect('SUM(remaining_quantity)', 'remaining_quantity')
                    .addSelect('SUM(delivered_quantity)', 'delivered_quantity')
                    .addSelect('SUM(original_quantity)', 'original_quantity')
                    .from(od, Entities_1.Entities.ORDER_DELIVERED)
                    .groupBy('"orderId"')
                    .addGroupBy('delivered_date');
                let query = typeorm_1
                    .getManager()
                    .createQueryBuilder()
                    .select(`${Entities_1.Entities.ORDER}.id`, 'id')
                    .addSelect('si_number', 'si_number')
                    .addSelect('total_orders.quantity', 'quantity')
                    .addSelect('total_orders_delivered.remaining_quantity', 'remaining_quantity')
                    .addSelect('total_orders_delivered.delivered_quantity', 'delivered_quantity')
                    .addSelect('total_orders_delivered.original_quantity', 'original_quantity')
                    .addSelect('amount_to_pay', 'amount_to_pay')
                    .addSelect('amount_to_pay', 'total')
                    .addSelect('order_status', 'order_status')
                    .addSelect('payment_remarks', 'payment_remarks')
                    .addSelect('payment_status', 'payment_status')
                    .addSelect(`TO_CHAR(order_date, 'MM/DD/YYYY')`, 'order_date')
                    .addSelect(`TO_CHAR(total_orders_delivered.delivered_date, 'MM/DD/YYYY')`, 'delivered_date')
                    .addSelect('order_remarks', 'order_remarks')
                    .addSelect(`customer_id`, 'customer_id')
                    .addSelect('reference_value', 'reference_value')
                    .addSelect('approval_ind', 'approval_ind')
                    .addSelect(`${Entities_1.Entities.USER}.name`, 'name')
                    .addSelect(`${Entities_1.Entities.USER}.contact_number`, 'contact_number')
                    .addSelect(`${Entities_1.Entities.USER}.address`, 'address')
                    .addSelect(`${Entities_1.Entities.ROLES}.role_description`, 'role')
                    .addSelect(`${Entities_1.Entities.CUSTOMER}.customer_over_payment`, 'over_payment')
                    .from(o, Entities_1.Entities.ORDER)
                    .leftJoin('(' + totalOrders.getQuery() + ')', 'total_orders', `total_orders."orderId" = ${Entities_1.Entities.ORDER}.id`)
                    .leftJoin('(' + totalOrdersDelivered.getQuery() + ')', 'total_orders_delivered', `total_orders_delivered."orderId" = ${Entities_1.Entities.ORDER}.id`)
                    .leftJoin(CustomerEntities_1.CustomerEntity, `${Entities_1.Entities.CUSTOMER}`, `${Entities_1.Entities.CUSTOMER}.id = ${Entities_1.Entities.ORDER}.customer_id`)
                    .leftJoin(UserEntities_1.UserEntity, `${Entities_1.Entities.USER}`, `${Entities_1.Entities.USER}.id = ${Entities_1.Entities.CUSTOMER}.user_id`)
                    .leftJoin(RoleEntities_1.RoleEntity, `${Entities_1.Entities.ROLES}`, `${Entities_1.Entities.ROLES}.id = ${Entities_1.Entities.USER}.role_id`)
                    .where(where);
                if (headers.filters !== undefined && ((_b = headers.filters) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                    let filters = JSON.parse(headers.filters);
                    filters.map((v) => {
                        if (v.id.includes('.')) {
                            let f = v.id.split('.');
                            let filter0 = f[0];
                            let filter1 = f[1];
                            query = query.andWhere(`UPPER(${filter0}.${filter1}) Like '%${v.value.toUpperCase()}%' `);
                        } else {
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
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success]), {
                    message: 'Successfully Retrieved data.',
                    results,
                    pagination: { total, current: pagination.current, pageCount }
                });
            } catch (err) {
                console.log('Error Dao: Query for getOrderDao Transaction -> ', err);
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
            }
        });
    const getOrderDeliveryPending = (payload, pagination, headers) =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _c;
            try {
                let defaultSort = Entities_1.Entities.ORDER_PENDING + '.' + 'request_date';
                if (headers.sort_by !== undefined) defaultSort = headers.sort_by;
                let where = '';
                if (payload.length > 0) {
                    if (payload[0].order_status.indexOf('|') > -1) {
                        let p = payload[0].order_status.split('|');
                        where = `order_status in ('${p[0]}','${p[1]}','${p[2]}')`;
                    } else where = `Upper(order_status) = Upper('${payload[0].order_status}')`;
                }
                const o = Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER_PENDING);
                const op = Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER_DELIVERED_PENDING);
                const totalOrders = typeorm_1
                    .getManager()
                    .createQueryBuilder()
                    .select('"orderId"', 'order_id')
                    .addSelect('max(reference_value)', 'reference_value')
                    .addSelect('SUM(delivered_quantity)', 'quantity')
                    .from(op, Entities_1.Entities.ORDER_DELIVERED_PENDING)
                    .leftJoin(OrderEntities_1.OrderEntity, `${Entities_1.Entities.ORDER}`, `${Entities_1.Entities.ORDER}.id = ${Entities_1.Entities.ORDER_DELIVERED_PENDING}.orderId`)
                    .groupBy('"orderId"');
                let resultTotalOrders = yield totalOrders.execute();
                console.log('------------------------------------');
                console.log(resultTotalOrders.length);
                console.log('------------------------------------');
                let query = typeorm_1
                    .getManager()
                    .createQueryBuilder()
                    .select(`${Entities_1.Entities.ORDER_PENDING}.id`, 'id')
                    .addSelect(
                        `CASE WHEN coalesce(total_orders.quantity,0) = 0 
                            THEN
                                ${Entities_1.Entities.ORDER}.id
                            ELSE
                                total_orders.order_id
                            END`,
                        'order_id'
                    )
                    .addSelect(`${Entities_1.Entities.ORDER_PENDING}.si_number`, 'si_number')
                    .addSelect('coalesce(total_orders.quantity,0) ', 'quantity')
                    .addSelect(`${Entities_1.Entities.ORDER_PENDING}.amount_to_pay`, 'amount_to_pay')
                    .addSelect(`${Entities_1.Entities.ORDER_PENDING}.amount_to_pay`, 'total')
                    .addSelect(`${Entities_1.Entities.ORDER_PENDING}.order_status`, 'order_status')
                    .addSelect(`${Entities_1.Entities.ORDER_PENDING}.payment_remarks`, 'payment_remarks')
                    .addSelect(`${Entities_1.Entities.ORDER_PENDING}.payment_status`, 'payment_status')
                    .addSelect(`${Entities_1.Entities.ORDER_PENDING}.order_date`, 'order_date')
                    .addSelect(`${Entities_1.Entities.ORDER_PENDING}.order_remarks`, 'order_remarks')
                    .addSelect(`${Entities_1.Entities.ORDER_PENDING}.customer_id`, 'customer_id')
                    .addSelect(`${Entities_1.Entities.ORDER_PENDING}.reference_value`, 'reference_value')
                    .addSelect(`${Entities_1.Entities.ORDER_PENDING}.approval_ind`, 'approval_ind')
                    .addSelect(`${Entities_1.Entities.USER}.name`, 'name')
                    .addSelect(`${Entities_1.Entities.USER}.contact_number`, 'contact_number')
                    .addSelect(`${Entities_1.Entities.USER}.address`, 'address')
                    .addSelect(`${Entities_1.Entities.ROLES}.role_description`, 'role')
                    .addSelect(`${Entities_1.Entities.CUSTOMER}.customer_over_payment`, 'over_payment')
                    .from(o, Entities_1.Entities.ORDER_PENDING)
                    .leftJoin('(' + totalOrders.getQuery() + ')', 'total_orders', `total_orders.reference_value = ${Entities_1.Entities.ORDER_PENDING}.reference_value`)
                    .leftJoin(CustomerEntities_1.CustomerEntity, `${Entities_1.Entities.CUSTOMER}`, `${Entities_1.Entities.CUSTOMER}.id = ${Entities_1.Entities.ORDER_PENDING}.customer_id`)
                    .leftJoin(OrderEntities_1.OrderEntity, `${Entities_1.Entities.ORDER}`, `${Entities_1.Entities.ORDER}.reference_value = ${Entities_1.Entities.ORDER_PENDING}.reference_value`)
                    .leftJoin(UserEntities_1.UserEntity, `${Entities_1.Entities.USER}`, `${Entities_1.Entities.USER}.id = ${Entities_1.Entities.CUSTOMER}.user_id`)
                    .leftJoin(RoleEntities_1.RoleEntity, `${Entities_1.Entities.ROLES}`, `${Entities_1.Entities.ROLES}.id = ${Entities_1.Entities.USER}.role_id`)
                    .where(where);
                if (headers.filters !== undefined && ((_c = headers.filters) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                    let filters = JSON.parse(headers.filters);
                    filters.map((v) => {
                        if (v.id.includes('.')) {
                            let f = v.id.split('.');
                            let filter0 = f[0];
                            let filter1 = f[1];
                            query = query.andWhere(`UPPER(${filter0}.${filter1}) Like '%${v.value.toUpperCase()}%' `);
                        } else {
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
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success]), {
                    message: 'Successfully Retrieved data.',
                    results,
                    pagination: { total, current: pagination.current, pageCount }
                });
            } catch (err) {
                console.log('Error Dao: Query for getOrderDao Transaction -> ', err);
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
            }
        });
    const getOrderProduct = (payload, pagination, headers) =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _d;
            try {
                let defaultSort = Entities_1.Entities.ORDER_PRODUCTS + '.' + 'id';
                if (headers.sort_by !== undefined) defaultSort = headers.sort_by;
                let query = typeorm_1
                    .getRepository(OrderProductEntities_1.OrderProductEntity)
                    .createQueryBuilder(Entities_1.Entities.ORDER_PRODUCTS)
                    .leftJoinAndSelect(`${Entities_1.Entities.ORDER_PRODUCTS}.product`, 'product', `product.id = ${Entities_1.Entities.ORDER_PRODUCTS}.productId`)
                    .where('"orderId" = :orderId', { orderId: payload[0].id });
                if (headers.filters !== undefined && ((_d = headers.filters) === null || _d === void 0 ? void 0 : _d.length) > 0) {
                    let filters = JSON.parse(headers.filters);
                    filters.map((v) => {
                        if (v.id.includes('.')) {
                            let f = v.id.split('.');
                            let filter0 = f[0];
                            let filter1 = f[1];
                            query = query.andWhere(`UPPER(${filter0}.${filter1}) Like '%${v.value.toUpperCase()}%' `);
                        } else {
                            query = query.andWhere(`UPPER(${Entities_1.Entities.ORDER}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
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
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success]), {
                    message: 'Successfully Retrieved data.',
                    results,
                    pagination: { total, current: pagination.current, pageCount }
                });
            } catch (err) {
                console.log('Error Dao: Query for getOrderProduct Transaction -> ', err);
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
            }
        });
    const getOrderDeliveredProduct = (payload, pagination, headers) =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _e;
            try {
                let defaultSort = Entities_1.Entities.ORDER_DELIVERED + '.' + 'id';
                if (headers.sort_by !== undefined) defaultSort = headers.sort_by;
                const o = Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER_DELIVERED);
                let query = typeorm_1
                    .getManager()
                    .createQueryBuilder()
                    .select(`${Entities_1.Entities.ORDER_DELIVERED}.id`, 'id')
                    .addSelect('original_quantity', 'original_quantity')
                    .addSelect('delivered_quantity', 'delivered_quantity')
                    .addSelect('remaining_quantity', 'remaining_quantity')
                    .addSelect('distributed_quantity', 'distributed_quantity')
                    .addSelect('"orderId"', 'order_id')
                    .addSelect('"productId"', 'product_id')
                    .addSelect(`${Entities_1.Entities.PRODUCTS}.product_code`, 'product_code')
                    .addSelect(`${Entities_1.Entities.PRODUCTS}.product_name`, 'product_name')
                    .from(o, Entities_1.Entities.ORDER_DELIVERED)
                    .leftJoin(OrderEntities_1.OrderEntity, `${Entities_1.Entities.ORDER}`, `${Entities_1.Entities.ORDER}.id = ${Entities_1.Entities.ORDER_DELIVERED}.orderId`)
                    .leftJoin(ProductEntities_1.ProductsEntity, `${Entities_1.Entities.PRODUCTS}`, `${Entities_1.Entities.PRODUCTS}.id = ${Entities_1.Entities.ORDER_DELIVERED}.productId`)
                    .where('"orderId" = :orderId', { orderId: payload[0].id });
                if (headers.filters !== undefined && ((_e = headers.filters) === null || _e === void 0 ? void 0 : _e.length) > 0) {
                    let filters = JSON.parse(headers.filters);
                    filters.map((v) => {
                        if (v.id.includes('.')) {
                            let f = v.id.split('.');
                            let filter0 = f[0];
                            let filter1 = f[1];
                            query = query.andWhere(`UPPER(${filter0}.${filter1}) Like '%${v.value.toUpperCase()}%' `);
                        } else {
                            query = query.andWhere(`UPPER(${Entities_1.Entities.ORDER_DELIVERED}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
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
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success]), {
                    message: 'Successfully Retrieved data.',
                    results,
                    pagination: { total, current: pagination.current, pageCount }
                });
            } catch (err) {
                console.log('Error Dao: Query for getOrderDeliveredProduct Transaction -> ', err);
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
            }
        });
    const getOrderDeliveryProduct = (payload, pagination, headers) =>
        __awaiter(void 0, void 0, void 0, function* () {
            var _f;
            try {
                let defaultSort = Entities_1.Entities.ORDER_DELIVERED_PENDING + '.' + 'id';
                if (headers.sort_by !== undefined) defaultSort = headers.sort_by;
                let query = typeorm_1
                    .getManager()
                    .createQueryBuilder()
                    .select('"orderId"', 'orderId')
                    .addSelect('"productId"', 'productId')
                    .addSelect(`${Entities_1.Entities.ORDER}.reference_value`, 'reference_value')
                    .addSelect('original_quantity', 'original_quantity')
                    .addSelect('delivered_quantity', 'delivered_quantity')
                    .addSelect('remaining_quantity', 'remaining_quantity')
                    .addSelect('product_code', 'product_code')
                    .addSelect('product_name', 'product_name')
                    .addSelect('delivered_date', 'delivered_date')
                    .from(Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER_DELIVERED_PENDING), Entities_1.Entities.ORDER_DELIVERED_PENDING)
                    .leftJoin(OrderEntities_1.OrderEntity, `${Entities_1.Entities.ORDER}`, `${Entities_1.Entities.ORDER}.id = ${Entities_1.Entities.ORDER_DELIVERED_PENDING}.orderId`)
                    .leftJoin(ProductEntities_1.ProductsEntity, `${Entities_1.Entities.PRODUCTS}`, `${Entities_1.Entities.PRODUCTS}.id = ${Entities_1.Entities.ORDER_DELIVERED_PENDING}.productId`)
                    .where(`${Entities_1.Entities.ORDER}.reference_value = '${payload[0].id}'`);
                if (headers.filters !== undefined && ((_f = headers.filters) === null || _f === void 0 ? void 0 : _f.length) > 0) {
                    let filters = JSON.parse(headers.filters);
                    filters.map((v) => {
                        if (v.id.includes('.')) {
                            let f = v.id.split('.');
                            let filter0 = f[0];
                            let filter1 = f[1];
                            query = query.andWhere(`UPPER(${filter0}.${filter1}) Like '%${v.value.toUpperCase()}%' `);
                        } else {
                            query = query.andWhere(`UPPER(${Entities_1.Entities.ORDER_DELIVERED_PENDING}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
                        }
                    });
                }
                const count = yield query.getCount();
                query
                    .skip(pagination.skip)
                    .take(pagination.take)
                    .orderBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC');
                const results = yield query.getRawMany();
                const total = count;
                let pageCount = Math.ceil(total / pagination.take) || 1;
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success]), {
                    message: 'Successfully Retrieved data.',
                    results,
                    pagination: { total, current: pagination.current, pageCount }
                });
            } catch (err) {
                console.log('Error Dao: Query for getOrderDeliveryProduct Transaction -> ', err);
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
            }
        });
    const createOrder = (payload) =>
        __awaiter(void 0, void 0, void 0, function* () {
            try {
                const customerExist = yield typeorm_1
                    .getManager()
                    .createQueryBuilder()
                    .select(`${Entities_1.Entities.USER}.name`, 'name')
                    .from(Schema_1.useSchemaAndTableName(Entities_1.Entities.CUSTOMER), Entities_1.Entities.CUSTOMER)
                    .leftJoin(UserEntities_1.UserEntity, `${Entities_1.Entities.USER}`, `${Entities_1.Entities.USER}.id = ${Entities_1.Entities.CUSTOMER}.user_id`)
                    .where(`${Entities_1.Entities.CUSTOMER}.id = '${payload.customer_id}'`)
                    .andWhere(`(customer_status = '' OR customer_status is null OR Upper(customer_status) like '%DELIVER%')`)
                    .getRawMany();
                if (customerExist.length === 0) {
                    return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `Customer has a pending transaction!` });
                }
                let o_id;
                const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) =>
                    __awaiter(void 0, void 0, void 0, function* () {
                        try {
                            const data = yield transactionEntityManager
                                .getRepository(OrderEntities_1.OrderEntity)
                                .createQueryBuilder(Entities_1.Entities.ORDER)
                                .insert()
                                .into(OrderEntities_1.OrderEntity)
                                .values(payload)
                                .execute();
                            let { id } = data.identifiers[0];
                            o_id = id;
                            payload.products.map((v) =>
                                __awaiter(void 0, void 0, void 0, function* () {
                                    const query2 = transactionEntityManager
                                        .getRepository(OrderProductEntities_1.OrderProductEntity)
                                        .createQueryBuilder(Entities_1.Entities.ORDER_PRODUCTS)
                                        .insert()
                                        .into(OrderProductEntities_1.OrderProductEntity)
                                        .values({ quantity: v.quantity, price: v.price, orderId: id, productId: v.id, total: v.quantity * v.price });
                                    yield query2.execute();
                                })
                            );
                            yield transactionEntityManager
                                .getRepository(CustomerEntities_1.CustomerEntity)
                                .createQueryBuilder(Entities_1.Entities.CUSTOMER)
                                .update(CustomerEntities_1.CustomerEntity)
                                .set({
                                    customer_balance: payload.amount_to_pay,
                                    customer_payment_status: payload.payment_status,
                                    customer_status: 'Pending Invoice'
                                })
                                .where('id = :id', { id: payload.customer_id })
                                .execute();
                            return true;
                        } catch (err) {
                            console.log('Error Dao: Create Order Dao Transaction -> ', err);
                            return false;
                        }
                    })
                );
                if (transaction) {
                    return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Created]), { o_id, message: 'Successfully created.' });
                } else {
                    console.log('Error Dao: Create Order Transaction -> ', 'Error Creating Order Transaction!');
                    return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: 'Error Creating Order!' });
                }
            } catch (err) {
                console.log('Error Dao: Create Order Transaction -> ', err);
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
            }
        });
    const updateOrder = (id, payload) =>
        __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (payload.customer_change === 'Y') {
                    const customerExist = yield typeorm_1
                        .getManager()
                        .createQueryBuilder()
                        .select(`${Entities_1.Entities.ORDER}.id`, 'id')
                        .addSelect(`${Entities_1.Entities.USER}.name`, 'name')
                        .from(Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER), Entities_1.Entities.ORDER)
                        .leftJoin(CustomerEntities_1.CustomerEntity, `${Entities_1.Entities.CUSTOMER}`, `${Entities_1.Entities.CUSTOMER}.id = ${Entities_1.Entities.ORDER}.customer_id`)
                        .leftJoin(UserEntities_1.UserEntity, `${Entities_1.Entities.USER}`, `${Entities_1.Entities.USER}.id = ${Entities_1.Entities.CUSTOMER}.user_id`)
                        .where(`customer_id = '${payload.customer_id}'`)
                        .andWhere(`UPPER(customer_status) != ''`)
                        .getRawMany();
                    if (customerExist.length > 0) {
                        return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), {
                            message: `Customer ${customerExist[0].name} has pending transaction!`
                        });
                    }
                }
                const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) =>
                    __awaiter(void 0, void 0, void 0, function* () {
                        try {
                            yield transactionEntityManager
                                .getRepository(OrderProductEntities_1.OrderProductEntity)
                                .createQueryBuilder(Entities_1.Entities.ORDER_PRODUCTS)
                                .delete()
                                .where({ orderId: id })
                                .execute();
                            const query = transactionEntityManager
                                .getRepository(OrderEntities_1.OrderEntity)
                                .createQueryBuilder(Entities_1.Entities.ORDER)
                                .update(OrderEntities_1.OrderEntity)
                                .set({
                                    customer_id: payload.customer_id,
                                    order_status: payload.order_status,
                                    payment_status: payload.payment_status,
                                    order_date: payload.order_date,
                                    amount_to_pay: payload.amount_to_pay
                                })
                                .where('id = :id', { id });
                            yield query.execute();
                            payload.products.map((v) =>
                                __awaiter(void 0, void 0, void 0, function* () {
                                    const query2 = transactionEntityManager
                                        .getRepository(OrderProductEntities_1.OrderProductEntity)
                                        .createQueryBuilder(Entities_1.Entities.ORDER_PRODUCTS)
                                        .insert()
                                        .into(OrderProductEntities_1.OrderProductEntity)
                                        .values({ quantity: v.quantity, price: v.price, orderId: id, productId: v.id, total: v.quantity * v.price });
                                    yield query2.execute();
                                })
                            );
                            yield transactionEntityManager
                                .getRepository(CustomerEntities_1.CustomerEntity)
                                .createQueryBuilder(Entities_1.Entities.CUSTOMER)
                                .update(CustomerEntities_1.CustomerEntity)
                                .set({
                                    customer_balance: payload.amount_to_pay,
                                    customer_payment_status: payload.payment_status,
                                    customer_status: 'Pending Invoice'
                                })
                                .where('id = :id', { id: payload.customer_id })
                                .execute();
                            return true;
                        } catch (err) {
                            console.log('Error Dao: Update Order Transaction -> ', 'Error Updating Order!');
                            return false;
                        }
                    })
                );
                if (transaction) {
                    return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Updated]), { message: 'Successfully updated.' });
                } else {
                    console.log('Error Dao: Update Order Transaction -> ', 'Error Updating Order!');
                    return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: 'Error Updating Order!' });
                }
            } catch (err) {
                console.log('Error Dao: update Order -> ', err);
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
            }
        });
    const updateOrderDeliveryPending = (id, payload) =>
        __awaiter(void 0, void 0, void 0, function* () {
            try {
                const pendingExist = yield typeorm_1
                    .getRepository(OrderPendingEntities_1.OrderPendigEntity)
                    .createQueryBuilder(Entities_1.Entities.ORDER_PENDING)
                    .where(`UPPER(reference_value) = UPPER('${payload.reference_value}')`)
                    .getMany();
                if (pendingExist.length > 0) {
                    return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), {
                        message: `SI # ${payload.si_number.toUpperCase()} is already pending for approval!`
                    });
                }
                const orderMain = yield typeorm_1.getRepository(OrderEntities_1.OrderEntity).createQueryBuilder(Entities_1.Entities.ORDER).where('id = :id', { id }).getOne();
                const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) =>
                    __awaiter(void 0, void 0, void 0, function* () {
                        try {
                            yield transactionEntityManager
                                .getRepository(OrderPendingEntities_1.OrderPendigEntity)
                                .createQueryBuilder(Entities_1.Entities.ORDER_PENDING)
                                .insert()
                                .into(OrderPendingEntities_1.OrderPendigEntity)
                                .values({
                                    si_number: orderMain === null || orderMain === void 0 ? void 0 : orderMain.si_number,
                                    customer_id: orderMain === null || orderMain === void 0 ? void 0 : orderMain.customer_id,
                                    order_date: orderMain === null || orderMain === void 0 ? void 0 : orderMain.order_date,
                                    amount_to_pay: orderMain === null || orderMain === void 0 ? void 0 : orderMain.amount_to_pay,
                                    order_status: payload.status,
                                    reference_value: orderMain === null || orderMain === void 0 ? void 0 : orderMain.reference_value,
                                    approval_ind: orderMain === null || orderMain === void 0 ? void 0 : orderMain.approval_ind,
                                    order_remarks: payload.remarks,
                                    request_by: payload.request_by,
                                    event_request: payload.event_request,
                                    request_date: payload.request_date
                                })
                                .execute();
                            yield transactionEntityManager
                                .getRepository(OrderEntities_1.OrderEntity)
                                .createQueryBuilder(Entities_1.Entities.ORDER)
                                .update(OrderEntities_1.OrderEntity)
                                .set({
                                    approval_ind: 'Y'
                                })
                                .where('id = :id', { id })
                                .execute();
                            payload.products.map((v) =>
                                __awaiter(void 0, void 0, void 0, function* () {
                                    const query2 = transactionEntityManager
                                        .getRepository(OrderDeliveredPendingEntities_1.OrderDeliveredPendingEntity)
                                        .createQueryBuilder(Entities_1.Entities.ORDER_DELIVERED_PENDING)
                                        .insert()
                                        .into(OrderDeliveredPendingEntities_1.OrderDeliveredPendingEntity)
                                        .values({
                                            original_quantity: v.original_quantity,
                                            delivered_quantity: v.delivered_quantity,
                                            remaining_quantity: v.remaining_quantity,
                                            orderId: id,
                                            productId: v.id,
                                            delivered_date: payload.delivered_date
                                        });
                                    yield query2.execute();
                                })
                            );
                            return true;
                        } catch (err) {
                            console.log('Error in ${payload.status} Order Delivery Pending Dao Transaction -> ', err);
                            return false;
                        }
                    })
                );
                if (transaction) {
                    return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Updated]), { message: 'Successfully submitted for approval.' });
                } else {
                    console.log('Error Dao: Rejecting Order Delivery Pending Transaction -> ', `Error in Order Delivery Pending!`);
                    return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `Error in Order Delivery Pending!` });
                }
            } catch (err) {
                console.log('Error Dao: Update Order Delivery Pending -> ', err);
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
            }
        });
    const approvalOrderDeliveryPending = (id, payload) =>
        __awaiter(void 0, void 0, void 0, function* () {
            try {
                const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) =>
                    __awaiter(void 0, void 0, void 0, function* () {
                        try {
                            if (payload.transaction_status === 'Rejected') {
                                let existOrderDelivered = yield transactionEntityManager
                                    .getRepository(OrderEntities_1.OrderEntity)
                                    .createQueryBuilder(Entities_1.Entities.ORDER)
                                    .select('order_status')
                                    .where('id = :orderId', { orderId: payload.order_id })
                                    .execute();
                                yield transactionEntityManager
                                    .getRepository(OrderEntities_1.OrderEntity)
                                    .createQueryBuilder(Entities_1.Entities.ORDER)
                                    .update(OrderEntities_1.OrderEntity)
                                    .set({
                                        approval_ind: 'N',
                                        order_status: existOrderDelivered[0].order_status
                                    })
                                    .where('id = :id', { id: payload.order_id })
                                    .execute();
                                yield transactionEntityManager.getRepository(OrderDeliveredPendingEntities_1.OrderDeliveredPendingEntity).delete({ orderId: payload.order_id });
                            } else {
                                console.log('approved here==========================');
                                console.log(payload);
                                console.log('-------------------------------------------');
                                yield transactionEntityManager
                                    .getRepository(OrderEntities_1.OrderEntity)
                                    .createQueryBuilder(Entities_1.Entities.ORDER)
                                    .update(OrderEntities_1.OrderEntity)
                                    .set({
                                        approval_ind: 'N',
                                        order_status: payload.order_status,
                                        order_remarks: payload.order_remarks
                                    })
                                    .where('id = :id', { id: payload.order_id })
                                    .execute();
                                let orderDeliveredPending = yield transactionEntityManager
                                    .getRepository(OrderDeliveredPendingEntities_1.OrderDeliveredPendingEntity)
                                    .createQueryBuilder(Entities_1.Entities.ORDER_DELIVERED_PENDING)
                                    .select('id')
                                    .addSelect('original_quantity')
                                    .addSelect('delivered_date')
                                    .addSelect('delivered_quantity')
                                    .addSelect('remaining_quantity')
                                    .addSelect('"orderId"', 'order_id')
                                    .addSelect('"productId"')
                                    .where('"orderId" = :orderId', { orderId: payload.order_id })
                                    .execute();
                                let existOrderDelivered = yield transactionEntityManager
                                    .getRepository(OrderDeliveredEntities_1.OrderDeliveredEntity)
                                    .createQueryBuilder(Entities_1.Entities.ORDER_DELIVERED)
                                    .select('id')
                                    .addSelect('delivered_quantity')
                                    .addSelect('delivered_date')
                                    .where('"orderId" = :orderId', { orderId: payload.order_id })
                                    .execute();
                                if (existOrderDelivered.length > 0) {
                                    orderDeliveredPending.map((v) =>
                                        __awaiter(void 0, void 0, void 0, function* () {
                                            let product = yield transactionEntityManager
                                                .getRepository(ProductEntities_1.ProductsEntity)
                                                .createQueryBuilder(Entities_1.Entities.PRODUCTS)
                                                .select('quantity')
                                                .where('id = :productId', { productId: v.productId })
                                                .execute();
                                            yield transactionEntityManager
                                                .getRepository(OrderDeliveredEntities_1.OrderDeliveredEntity)
                                                .createQueryBuilder(Entities_1.Entities.ORDER_DELIVERED)
                                                .update(OrderDeliveredEntities_1.OrderDeliveredEntity)
                                                .set({
                                                    delivered_quantity: parseInt(existOrderDelivered[0].delivered_quantity) + parseInt(v.delivered_quantity),
                                                    remaining_quantity: v.remaining_quantity
                                                })
                                                .where('"orderId" = :orderId', { orderId: payload.order_id })
                                                .andWhere('"productId" = :productId', { productId: v.productId })
                                                .execute();
                                            yield transactionEntityManager
                                                .getRepository(ProductEntities_1.ProductsEntity)
                                                .createQueryBuilder(Entities_1.Entities.PRODUCTS)
                                                .update(ProductEntities_1.ProductsEntity)
                                                .set({
                                                    quantity: parseInt(product[0].quantity) - parseInt(v.delivered_quantity)
                                                })
                                                .where('id = :productId', { productId: v.productId })
                                                .execute();
                                        })
                                    );
                                } else {
                                    orderDeliveredPending.map((v) =>
                                        __awaiter(void 0, void 0, void 0, function* () {
                                            let product = yield transactionEntityManager
                                                .getRepository(ProductEntities_1.ProductsEntity)
                                                .createQueryBuilder(Entities_1.Entities.PRODUCTS)
                                                .select('quantity')
                                                .where('id = :productId', { productId: v.productId })
                                                .execute();
                                            yield transactionEntityManager
                                                .getRepository(OrderDeliveredEntities_1.OrderDeliveredEntity)
                                                .createQueryBuilder(Entities_1.Entities.ORDER_DELIVERED)
                                                .insert()
                                                .into(OrderDeliveredEntities_1.OrderDeliveredEntity)
                                                .values({
                                                    original_quantity: v.original_quantity,
                                                    delivered_quantity: v.delivered_quantity,
                                                    remaining_quantity: v.remaining_quantity,
                                                    delivered_date: v.delivered_date,
                                                    distributed_quantity: 0,
                                                    orderId: payload.order_id,
                                                    productId: v.productId
                                                })
                                                .execute();
                                            yield transactionEntityManager
                                                .getRepository(ProductEntities_1.ProductsEntity)
                                                .createQueryBuilder(Entities_1.Entities.PRODUCTS)
                                                .update(ProductEntities_1.ProductsEntity)
                                                .set({
                                                    quantity: parseInt(product[0].quantity) - parseInt(v.delivered_quantity)
                                                })
                                                .where('id = :productId', { productId: v.productId })
                                                .execute();
                                        })
                                    );
                                }
                            }
                            yield transactionEntityManager.getRepository(OrderPendingEntities_1.OrderPendigEntity).delete({ id });
                            yield transactionEntityManager.getRepository(OrderDeliveredPendingEntities_1.OrderDeliveredPendingEntity).delete({ orderId: payload.order_id });
                            return true;
                        } catch (err) {
                            console.log(`Error in ${payload.status} Order Approval Delivery Pending Dao Transaction -> `, err);
                            return false;
                        }
                    })
                );
                if (transaction) {
                    return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Approval]), { message: `Successfully ${payload.transaction_status}.` });
                } else {
                    console.log('Error Dao: Rejecting Order Approval Delivery Pending Transaction -> ', `Error in ${payload.transaction_status} Order Delivery Pending!`);
                    return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), {
                        message: `Error in ${payload.transaction_status} Order Delivery Pending!`
                    });
                }
            } catch (err) {
                console.log('Error Dao: Order Approval Delivery  Pending -> ', err);
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
            }
        });
    const deleteOrder = (id, _payload) =>
        __awaiter(void 0, void 0, void 0, function* () {
            try {
                const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) =>
                    __awaiter(void 0, void 0, void 0, function* () {
                        try {
                            let p = id.split('|');
                            yield transactionEntityManager
                                .getRepository(OrderProductEntities_1.OrderProductEntity)
                                .createQueryBuilder(Entities_1.Entities.ORDER_PRODUCTS)
                                .delete()
                                .where({ orderId: p[0] })
                                .execute();
                            yield transactionEntityManager.getRepository(OrderEntities_1.OrderEntity).delete({ id: p[0] });
                            yield transactionEntityManager
                                .getRepository(CustomerEntities_1.CustomerEntity)
                                .createQueryBuilder(Entities_1.Entities.CUSTOMER)
                                .update(CustomerEntities_1.CustomerEntity)
                                .set({
                                    customer_balance: 0,
                                    customer_payment_status: '',
                                    customer_status: ''
                                })
                                .where('id = :id', { id: p[1] })
                                .execute();
                            return true;
                        } catch (err) {
                            console.log('Error Dao: delete Order -> ', err);
                            return false;
                        }
                    })
                );
                if (transaction) {
                    return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Deleted]), { message: 'Successfully deleted.' });
                } else {
                    console.log('Error Dao: delete Order -> ', 'Error Deleting Order!');
                    return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: 'Error Deleting Order!' });
                }
            } catch (err) {
                console.log('Error Dao: delete Order -> ', err);
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
            }
        });
    const restoreOrder = (id, payload) =>
        __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield typeorm_1
                    .getRepository(OrderEntities_1.OrderEntity)
                    .createQueryBuilder(Entities_1.Entities.ORDER)
                    .update(OrderEntities_1.OrderEntity)
                    .set(Object.assign(Object.assign({}, payload), { updated_at: new Date() }))
                    .where('id = :id', { id })
                    .execute();
                yield typeorm_1.getRepository(OrderEntities_1.OrderEntity).restore({ id });
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Restored]), { message: 'Successfully restored.' });
            } catch (err) {
                console.log('Error Dao: restoreOrder -> ', err);
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
            }
        });
    const getOrderReport = (request) =>
        __awaiter(void 0, void 0, void 0, function* () {
            try {
                let df_value = request.df;
                let dt_value = request.dt;
                let df_date = moment_1.default(new Date(df_value)).format('DD/MM/yyyy');
                let dt_date = moment_1.default(new Date(dt_value)).add(1, 'day').format('DD/MM/yyyy');
                let queries = {
                    relations: ['order_customer'],
                    where: { created_at: typeorm_1.Between(df_date, dt_date) },
                    order: { created_at: 'ASC' }
                };
                const results = yield OrderEntities_1.OrderEntity.find(queries);
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success]), { message: 'Successfully Retrieved data.', results });
            } catch (err) {
                console.log('Error Dao: Query for getOrderReport Transaction -> ', err);
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
            }
        });
    return {
        getOrder,
        getOrderDelivery,
        getOrderDeliveryPending,
        getOrderProduct,
        getOrderDeliveredProduct,
        getOrderDeliveryProduct,
        createOrder,
        updateOrder,
        updateOrderDeliveryPending,
        approvalOrderDeliveryPending,
        deleteOrder,
        restoreOrder,
        getOrderReport
    };
};
//# sourceMappingURL=OrderDao.js.map

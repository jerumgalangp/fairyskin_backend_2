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
exports.useTrackingDao = void 0;
const CustomerEntities_1 = require("./../entities/CustomerEntities");
const OrderDeliveredEntities_1 = require("./../entities/OrderDeliveredEntities");
const ProductEntities_1 = require("./../entities/ProductEntities");
const RoleEntities_1 = require("./../entities/RoleEntities");
const TrackingMainEntities_1 = require("./../entities/TrackingMainEntities");
const UserEntities_1 = require("./../entities/UserEntities");
const Schema_1 = require("./../util/Schema");
const typeorm_1 = require("typeorm");
const HttpConstant_1 = require("../constant/HttpConstant");
const Entities_1 = require("./../constant/Entities");
const TrackingEntities_1 = require("./../entities/TrackingEntities");
exports.useTrackingDao = () => {
    const getOrdersForTracking = (payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            let defaultSort = Entities_1.Entities.ORDER + '.' + 'created_at';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            let where = '';
            if (payload.length > 0) {
                let role = payload[1].role_name ? payload[1].role_name._value : '';
                if (role.indexOf('super_admin') > -1) {
                    where = `${Entities_1.Entities.ORDER}.order_status in ('Delivered' , 'Partially Delivered', 'Picked Up', 'Partially Picked Up')`;
                }
                else {
                    where = `${Entities_1.Entities.CUSTOMER}.user_id = '${payload[0].customer_name}' AND ${Entities_1.Entities.ORDER}.order_status in ('Delivered' , 'Partially Delivered', 'Picked Up', 'Partially Picked Up')`;
                }
            }
            const o = Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER);
            const op = Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER_DELIVERED);
            const od = Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER_DISTRIBUTED_MAIN);
            const totalOrders = typeorm_1.getManager()
                .createQueryBuilder()
                .select('"orderId"', 'orderId')
                .addSelect('SUM(original_quantity)', 'original_quantity')
                .addSelect('SUM(delivered_quantity)', 'delivered_quantity')
                .from(op, Entities_1.Entities.ORDER_DELIVERED)
                .groupBy('"orderId"');
            const totalDistributed = typeorm_1.getManager()
                .createQueryBuilder()
                .select('"order_id"', 'order_id')
                .addSelect('MAX(reference_value)', 'reference_value')
                .addSelect('SUM(distributed_quantity)', 'distributed_quantity')
                .from(od, Entities_1.Entities.ORDER_DISTRIBUTED_MAIN)
                .groupBy('"order_id"');
            let query = typeorm_1.getManager()
                .createQueryBuilder()
                .select(`${Entities_1.Entities.ORDER}.id`, 'id')
                .addSelect('si_number', 'si_number')
                .addSelect('total_orders.original_quantity', 'original_quantity')
                .addSelect('total_orders.delivered_quantity', 'delivered_quantity')
                .addSelect('total_distributed_main.distributed_quantity', 'distributed_quantity')
                .addSelect('total_distributed_main.reference_value', 'reference_value')
                .addSelect('(total_orders.delivered_quantity - coalesce(total_distributed_main.distributed_quantity,0))', 'remaining_quantity')
                .addSelect('amount_to_pay', 'total')
                .addSelect('order_status', 'order_status')
                .addSelect('order_date', 'order_date')
                .addSelect('order_remarks', 'order_remarks')
                .addSelect(`customer_id`, 'customer_id')
                .addSelect(`${Entities_1.Entities.USER}.name`, 'name')
                .addSelect(`${Entities_1.Entities.USER}.contact_number`, 'contact_number')
                .addSelect(`${Entities_1.Entities.USER}.address`, 'address')
                .addSelect(`${Entities_1.Entities.ROLES}.role_description`, 'role')
                .addSelect(`${Entities_1.Entities.CUSTOMER}.customer_over_payment`, 'over_payment')
                .from(o, Entities_1.Entities.ORDER)
                .leftJoin('(' + totalOrders.getQuery() + ')', 'total_orders', `total_orders."orderId" = ${Entities_1.Entities.ORDER}.id`)
                .leftJoin('(' + totalDistributed.getQuery() + ')', 'total_distributed_main', `total_distributed_main."order_id" = ${Entities_1.Entities.ORDER}.id`)
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
            console.log('Error Dao: Query for getOrdersForTracking Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const getTracking = (payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            let defaultSort = Entities_1.Entities.ORDER_DISTRIBUTED + '.' + 'created_at';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            let where = '';
            if (payload.length > 0) {
                if (payload[0].Tracking_status.indexOf('|') > -1) {
                    let p = payload[0].Tracking_status.split('|');
                    where = `Tracking_status in ('${p[0]}','${p[1]}')`;
                }
                else
                    where = `Upper(Tracking_status) = Upper('${payload[0].Tracking_status}')`;
            }
            const o = Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER_DISTRIBUTED);
            const op = Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER_PRODUCTS);
            const totalTrackings = typeorm_1.getManager()
                .createQueryBuilder()
                .select('"trackingId"', 'TrackingId')
                .addSelect('SUM(quantity)', 'quantity')
                .from(op, Entities_1.Entities.ORDER_PRODUCTS)
                .groupBy('"trackingId"');
            let query = typeorm_1.getManager()
                .createQueryBuilder()
                .select(`${Entities_1.Entities.ORDER_DISTRIBUTED}.id`, 'id')
                .addSelect('si_number', 'si_number')
                .addSelect('total_Trackings.quantity', 'quantity')
                .addSelect('amount_to_pay', 'amount_to_pay')
                .addSelect('amount_to_pay', 'total')
                .addSelect('tracking_status', 'Tracking_status')
                .addSelect('payment_remarks', 'payment_remarks')
                .addSelect('payment_status', 'payment_status')
                .addSelect('Tracking_date', 'Tracking_date')
                .addSelect('Tracking_remarks', 'Tracking_remarks')
                .addSelect('reference_value', 'reference_value')
                .addSelect('approval_ind', 'approval_ind')
                .addSelect(`customer_id`, 'customer_id')
                .addSelect(`${Entities_1.Entities.USER}.name`, 'name')
                .addSelect(`${Entities_1.Entities.USER}.contact_number`, 'contact_number')
                .addSelect(`${Entities_1.Entities.USER}.address`, 'address')
                .addSelect(`${Entities_1.Entities.ROLES}.role_description`, 'role')
                .addSelect(`${Entities_1.Entities.CUSTOMER}.customer_over_payment`, 'over_payment')
                .from(o, Entities_1.Entities.ORDER_DISTRIBUTED)
                .leftJoin('(' + totalTrackings.getQuery() + ')', 'total_Trackings', `total_Trackings."TrackingId" = ${Entities_1.Entities.ORDER_DISTRIBUTED}.id`)
                .leftJoin(CustomerEntities_1.CustomerEntity, `${Entities_1.Entities.CUSTOMER}`, `${Entities_1.Entities.CUSTOMER}.id = ${Entities_1.Entities.ORDER_DISTRIBUTED}.customer_id`)
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
                    }
                    else {
                        let w = `${Entities_1.Entities.ORDER_DISTRIBUTED}.${v.id}`;
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
                .TrackingBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC');
            const results = yield query.getRawMany();
            const total = count;
            let pageCount = Math.ceil(total / pagination.take) || 1;
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success]), { message: 'Successfully Retrieved data.', results, pagination: { total, current: pagination.current, pageCount } });
        }
        catch (err) {
            console.log('Error Dao: Query for getTrackingDao Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const getOrderDistributed = (payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        try {
            let defaultSort = Entities_1.Entities.ORDER_DISTRIBUTED + '.' + 'id';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            const o = Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER_DISTRIBUTED);
            let param = payload[0].id.split('|');
            const orderExist = yield typeorm_1.getManager()
                .createQueryBuilder()
                .select(`${Entities_1.Entities.ORDER}.si_number`, 'si_number')
                .from(Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER), Entities_1.Entities.ORDER)
                .where(`${Entities_1.Entities.ORDER}.id = '${param[2]}'`)
                .andWhere(`${Entities_1.Entities.ORDER}.si_number = '${param[3]}'`)
                .getRawMany();
            if (orderExist.length === 0) {
                console.log('Error Dao: Query for getOrderDistributed Transaction -> ');
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: 'No Order for that si number!' });
            }
            let query = typeorm_1.getManager()
                .createQueryBuilder()
                .select(`${Entities_1.Entities.ORDER_DISTRIBUTED}.id`, 'id')
                .addSelect(`${Entities_1.Entities.ORDER_DISTRIBUTED}.quantity`, 'quantity')
                .addSelect('date_distributed', 'date_distributed')
                .addSelect(`${Entities_1.Entities.ORDER_DISTRIBUTED}.reference_value`, 'reference_value')
                .addSelect('"productId"', 'product_id')
                .addSelect('"customerId"', 'customer_id')
                .addSelect(`${Entities_1.Entities.PRODUCTS}.product_code`, 'product_code')
                .addSelect(`${Entities_1.Entities.PRODUCTS}.product_name`, 'product_name')
                .addSelect(`${Entities_1.Entities.USER}.name`, 'name')
                .addSelect(`${Entities_1.Entities.USER}.id`, 'user_id')
                .from(o, Entities_1.Entities.ORDER_DISTRIBUTED)
                .leftJoin(TrackingMainEntities_1.TrackingMainEntity, `${Entities_1.Entities.ORDER_DISTRIBUTED_MAIN}`, `${Entities_1.Entities.ORDER_DISTRIBUTED_MAIN}.reference_value = ${Entities_1.Entities.ORDER_DISTRIBUTED}.reference_value`)
                .leftJoin(ProductEntities_1.ProductsEntity, `${Entities_1.Entities.PRODUCTS}`, `${Entities_1.Entities.PRODUCTS}.id = ${Entities_1.Entities.ORDER_DISTRIBUTED}.productId`)
                .leftJoin(UserEntities_1.UserEntity, `${Entities_1.Entities.USER}`, `${Entities_1.Entities.USER}.id = ${Entities_1.Entities.ORDER_DISTRIBUTED}."customerId"`)
                .where(`${Entities_1.Entities.ORDER_DISTRIBUTED_MAIN}."order_id" = :orderId`, { orderId: param[2] });
            if (headers.filters !== undefined && ((_c = headers.filters) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                let filters = JSON.parse(headers.filters);
                filters.map((v) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        let filter0 = f[0];
                        let filter1 = f[1];
                        query = query.andWhere(`UPPER(${filter0}.${filter1}) Like '%${v.value.toUpperCase()}%' `);
                    }
                    else {
                        if (v.id === 'name')
                            query = query.andWhere(`UPPER(${Entities_1.Entities.USER}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
                        else if (v.id === 'product_code')
                            query = query.andWhere(`UPPER(${Entities_1.Entities.PRODUCTS}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
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
            console.log('Error Dao: Query for getOrderDistributed Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const createTracking = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let o_id;
            const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const data = yield transactionEntityManager
                        .getRepository(TrackingMainEntities_1.TrackingMainEntity)
                        .createQueryBuilder(Entities_1.Entities.ORDER_DISTRIBUTED_MAIN)
                        .insert()
                        .into(TrackingMainEntities_1.TrackingMainEntity)
                        .values({
                        user_id: payload.user_id,
                        order_id: payload.order_id,
                        reference_value: payload.reference_value,
                        distributed_quantity: payload.distributed_quantity
                    })
                        .execute();
                    let { id } = data.identifiers[0];
                    o_id = id;
                    yield Promise.all(payload.products.map((v) => __awaiter(void 0, void 0, void 0, function* () {
                        let d = 0;
                        let distributed_quantity = yield transactionEntityManager
                            .getRepository(OrderDeliveredEntities_1.OrderDeliveredEntity)
                            .createQueryBuilder(Entities_1.Entities.ORDER_DELIVERED)
                            .select('distributed_quantity')
                            .where('"orderId" = :orderId', { orderId: payload.order_id })
                            .andWhere('"productId" = :productId', { productId: v.id })
                            .execute();
                        if (distributed_quantity === null || distributed_quantity === undefined) {
                            d = 0;
                        }
                        else {
                            d = distributed_quantity[0].distributed_quantity === null ? 0 : distributed_quantity[0].distributed_quantity;
                        }
                        yield transactionEntityManager
                            .getRepository(OrderDeliveredEntities_1.OrderDeliveredEntity)
                            .createQueryBuilder(Entities_1.Entities.ORDER_DELIVERED)
                            .update(OrderDeliveredEntities_1.OrderDeliveredEntity)
                            .set({
                            distributed_quantity: parseInt(d) + parseInt(v.quantity)
                        })
                            .where('"orderId" = :orderId', { orderId: payload.order_id })
                            .andWhere('"productId" = :productId', { productId: v.id })
                            .execute();
                        const query2 = transactionEntityManager.getRepository(TrackingEntities_1.TrackingEntity).createQueryBuilder(Entities_1.Entities.ORDER_DISTRIBUTED).insert().into(TrackingEntities_1.TrackingEntity).values({
                            date_distributed: payload.date_distributed,
                            quantity: v.quantity,
                            customerId: payload.customer_id,
                            productId: v.id,
                            reference_value: payload.reference_value
                        });
                        yield query2.execute();
                    })));
                    return true;
                }
                catch (err) {
                    console.log('Error Dao: Create Tracking Dao Transaction -> ', err);
                    return false;
                }
            }));
            if (transaction) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Created]), { o_id, message: 'Successfully created.' });
            }
            else {
                console.log('Error Dao: Create Tracking Transaction -> ', 'Error Creating Tracking Transaction!');
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: 'Error Creating Tracking!' });
            }
        }
        catch (err) {
            console.log('Error Dao: Create Tracking Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const updateTracking = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    let d_main = 0;
                    let d_order = 0;
                    let distributed_quantity_main = yield transactionEntityManager
                        .getRepository(TrackingMainEntities_1.TrackingMainEntity)
                        .createQueryBuilder(Entities_1.Entities.ORDER_DISTRIBUTED_MAIN)
                        .select('distributed_quantity')
                        .where('"order_id" = :orderId', { orderId: payload.order_id })
                        .andWhere('reference_value = :reference_value', { reference_value: payload.reference_value })
                        .execute();
                    if (distributed_quantity_main === null || distributed_quantity_main === undefined) {
                        d_main = parseInt(payload.original_quantity.toString()) + parseInt(payload.distributed_quantity.toString());
                    }
                    else {
                        d_main = parseInt(distributed_quantity_main[0].distributed_quantity) - parseInt(payload.original_quantity.toString()) + parseInt(payload.distributed_quantity.toString());
                    }
                    let distributed_quantity_delivered = yield transactionEntityManager
                        .getRepository(OrderDeliveredEntities_1.OrderDeliveredEntity)
                        .createQueryBuilder(Entities_1.Entities.ORDER_DELIVERED)
                        .select('distributed_quantity')
                        .where('"orderId" = :orderId', { orderId: payload.order_id })
                        .andWhere('"productId" = :productId', { productId: payload.product_id })
                        .execute();
                    if (distributed_quantity_delivered === null || distributed_quantity_delivered === undefined) {
                        d_order = parseInt(payload.original_quantity.toString()) + parseInt(payload.distributed_quantity.toString());
                    }
                    else {
                        d_order = parseInt(distributed_quantity_delivered[0].distributed_quantity) - parseInt(payload.original_quantity.toString()) + parseInt(payload.distributed_quantity.toString());
                    }
                    yield transactionEntityManager
                        .getRepository(TrackingEntities_1.TrackingEntity)
                        .createQueryBuilder(Entities_1.Entities.ORDER_DISTRIBUTED)
                        .update(TrackingEntities_1.TrackingEntity)
                        .set({
                        quantity: payload.distributed_quantity,
                        date_distributed: payload.date_distributed,
                        customerId: payload.customer_id
                    })
                        .where('id = :id', { id: id })
                        .execute();
                    yield transactionEntityManager
                        .getRepository(TrackingMainEntities_1.TrackingMainEntity)
                        .createQueryBuilder(Entities_1.Entities.ORDER_DISTRIBUTED_MAIN)
                        .update(TrackingMainEntities_1.TrackingMainEntity)
                        .set({
                        distributed_quantity: d_main
                    })
                        .where('"order_id" = :orderId', { orderId: payload.order_id })
                        .andWhere('reference_value = :reference_value', { reference_value: payload.reference_value })
                        .execute();
                    yield transactionEntityManager
                        .getRepository(OrderDeliveredEntities_1.OrderDeliveredEntity)
                        .createQueryBuilder(Entities_1.Entities.ORDER_DELIVERED)
                        .update(OrderDeliveredEntities_1.OrderDeliveredEntity)
                        .set({
                        distributed_quantity: d_order
                    })
                        .where('"orderId" = :orderId', { orderId: payload.order_id })
                        .andWhere('"productId" = :productId', { productId: payload.product_id })
                        .execute();
                    return true;
                }
                catch (err) {
                    console.log('Error Dao: Update Tracking Transaction -> ', 'Error Updating Tracking!');
                    return false;
                }
            }));
            if (transaction) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Updated]), { message: 'Successfully updated.' });
            }
            else {
                console.log('Error Dao: Update Tracking Transaction -> ', 'Error Updating Tracking!');
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: 'Error Updating Tracking!' });
            }
        }
        catch (err) {
            console.log('Error Dao: update Tracking -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const deleteTracking = (id, _payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    let p = id.split('|');
                    let d_order = 0;
                    let no_other_ref = yield transactionEntityManager
                        .getRepository(TrackingEntities_1.TrackingEntity)
                        .createQueryBuilder(Entities_1.Entities.ORDER_DISTRIBUTED)
                        .select('id')
                        .addSelect('quantity')
                        .where('reference_value = :reference_value', { reference_value: p[1] })
                        .execute();
                    let order_distributed_main = yield transactionEntityManager
                        .getRepository(TrackingMainEntities_1.TrackingMainEntity)
                        .createQueryBuilder(Entities_1.Entities.ORDER_DISTRIBUTED_MAIN)
                        .select('"order_id"', 'order_id')
                        .addSelect(`${Entities_1.Entities.ORDER_DELIVERED}.distributed_quantity`, 'distributed_quantity')
                        .addSelect(`${Entities_1.Entities.ORDER_DISTRIBUTED_MAIN}.distributed_quantity`, 'main_distributed_quantity')
                        .leftJoin(OrderDeliveredEntities_1.OrderDeliveredEntity, `${Entities_1.Entities.ORDER_DELIVERED}`, `${Entities_1.Entities.ORDER_DELIVERED}."orderId" = ${Entities_1.Entities.ORDER_DISTRIBUTED_MAIN}.order_id`)
                        .where(`${Entities_1.Entities.ORDER_DISTRIBUTED_MAIN}.reference_value = :reference_value`, { reference_value: p[1] })
                        .execute();
                    if (no_other_ref.length === 1) {
                        console.log('-----------no_other_ref.length === 1---------------');
                        d_order = parseInt(order_distributed_main[0].distributed_quantity) - parseInt(no_other_ref[0].quantity);
                        yield transactionEntityManager
                            .getRepository(OrderDeliveredEntities_1.OrderDeliveredEntity)
                            .createQueryBuilder(Entities_1.Entities.ORDER_DELIVERED)
                            .update(OrderDeliveredEntities_1.OrderDeliveredEntity)
                            .set({
                            distributed_quantity: d_order
                        })
                            .where('"orderId" = :orderId', { orderId: order_distributed_main[0].order_id })
                            .andWhere('"productId" = :productId', { productId: p[2] })
                            .execute();
                        yield transactionEntityManager.getRepository(TrackingEntities_1.TrackingEntity).delete({ id: p[0] });
                        yield transactionEntityManager
                            .getRepository(TrackingMainEntities_1.TrackingMainEntity)
                            .createQueryBuilder(Entities_1.Entities.ORDER_DISTRIBUTED_MAIN)
                            .delete()
                            .where('reference_value = :reference_value', { reference_value: p[1] })
                            .execute();
                    }
                    else {
                        console.log('-----------no_other_ref.length > 1---------------');
                        let q = no_other_ref.find((c) => c.id === p[0]);
                        d_order = parseInt(order_distributed_main[0].distributed_quantity) - parseInt(q.quantity);
                        yield transactionEntityManager
                            .getRepository(OrderDeliveredEntities_1.OrderDeliveredEntity)
                            .createQueryBuilder(Entities_1.Entities.ORDER_DELIVERED)
                            .update(OrderDeliveredEntities_1.OrderDeliveredEntity)
                            .set({
                            distributed_quantity: d_order
                        })
                            .where('"orderId" = :orderId', { orderId: order_distributed_main[0].order_id })
                            .andWhere('"productId" = :productId', { productId: p[2] })
                            .execute();
                        yield transactionEntityManager
                            .getRepository(TrackingMainEntities_1.TrackingMainEntity)
                            .createQueryBuilder(Entities_1.Entities.ORDER_DISTRIBUTED_MAIN)
                            .update(TrackingMainEntities_1.TrackingMainEntity)
                            .set({
                            distributed_quantity: parseInt(order_distributed_main[0].main_distributed_quantity.toString()) - parseInt(q.quantity)
                        })
                            .where('reference_value = :reference_value', { reference_value: p[1] })
                            .execute();
                        yield transactionEntityManager.getRepository(TrackingEntities_1.TrackingEntity).delete({ id: p[0] });
                    }
                    return true;
                }
                catch (err) {
                    console.log('Error Dao: delete Tracking -> ', err);
                    return false;
                }
            }));
            if (transaction) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Deleted]), { message: 'Successfully deleted.' });
            }
            else {
                console.log('Error Dao: delete Tracking -> ', 'Error Deleting Tracking!');
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: 'Error Deleting Tracking!' });
            }
        }
        catch (err) {
            console.log('Error Dao: delete Tracking -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const restoreTracking = (_id, _payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Restored]), { message: 'Successfully restored.' });
        }
        catch (err) {
            console.log('Error Dao: restoreTracking -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    return {
        getOrdersForTracking,
        getTracking,
        getOrderDistributed,
        createTracking,
        updateTracking,
        deleteTracking,
        restoreTracking
    };
};
//# sourceMappingURL=TrackingDao.js.map
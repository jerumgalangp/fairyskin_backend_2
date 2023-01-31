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
exports.usePaymentDao = void 0;
const typeorm_1 = require("typeorm");
const HttpConstant_1 = require("../constant/HttpConstant");
const Entities_1 = require("./../constant/Entities");
const CustomerEntities_1 = require("./../entities/CustomerEntities");
const InvoiceEntities_1 = require("./../entities/InvoiceEntities");
const OrderEntities_1 = require("./../entities/OrderEntities");
const PaymentEntities_1 = require("./../entities/PaymentEntities");
const RoleEntities_1 = require("./../entities/RoleEntities");
const UserEntities_1 = require("./../entities/UserEntities");
const Schema_1 = require("./../util/Schema");
exports.usePaymentDao = () => {
    const getPayment = (_payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            let defaultSort = Entities_1.Entities.PAYMENT + '.' + 'payment_date';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            const o = Schema_1.useSchemaAndTableName(Entities_1.Entities.PAYMENT);
            const paymentGroup = typeorm_1.getManager()
                .createQueryBuilder()
                .select('payment_invoice_id', 'payment_invoice_id')
                .addSelect('MAX(payment_date)', 'payment_date')
                .from(o, Entities_1.Entities.PAYMENT)
                .groupBy('payment_invoice_id');
            let query = typeorm_1.getManager()
                .createQueryBuilder()
                .select(`${Entities_1.Entities.PAYMENT}.id`, 'id')
                .addSelect(`${Entities_1.Entities.INVOICE}.invoice_code`, 'invoice_code')
                .addSelect(`${Entities_1.Entities.INVOICE}.invoice_order_id`, 'invoice_order_id')
                .addSelect(`${Entities_1.Entities.INVOICE}.total_order`, 'total_order')
                .addSelect(`${Entities_1.Entities.ORDER}.si_number`, 'si_number')
                .addSelect(`${Entities_1.Entities.ORDER}.order_date`, 'order_date')
                .addSelect(`${Entities_1.Entities.USER}.name`, 'name')
                .addSelect(`${Entities_1.Entities.USER}.address`, 'address')
                .addSelect(`${Entities_1.Entities.USER}.contact_number`, 'contact_number')
                .addSelect(`${Entities_1.Entities.ROLES}.role_description`, 'role')
                .addSelect(`${Entities_1.Entities.PAYMENT}.payment_invoice_id`, 'payment_invoice_id')
                .addSelect(`${Entities_1.Entities.PAYMENT}.previous_over_payment`, 'previous_over_payment')
                .addSelect(`${Entities_1.Entities.PAYMENT}.payment_amount`, 'payment_amount')
                .addSelect(`${Entities_1.Entities.PAYMENT}.payment_balance`, 'payment_balance')
                .addSelect(`${Entities_1.Entities.PAYMENT}.over_payment`, 'over_payment')
                .addSelect(`${Entities_1.Entities.PAYMENT}.account_balance`, 'account_balance')
                .addSelect(`${Entities_1.Entities.PAYMENT}.payment_date`, 'payment_date')
                .addSelect(`${Entities_1.Entities.PAYMENT}.description`, 'description')
                .addSelect(`${Entities_1.Entities.CUSTOMER}.fully_paid`, 'fully_paid')
                .addSelect(`${Entities_1.Entities.CUSTOMER}.customer_area`, 'customer_area')
                .from(o, Entities_1.Entities.PAYMENT)
                .innerJoin('(' + paymentGroup.getQuery() + ')', 'payment_group', `payment_group.payment_invoice_id = ${Entities_1.Entities.PAYMENT}.payment_invoice_id and payment_group.payment_date = ${Entities_1.Entities.PAYMENT}.payment_date`)
                .leftJoin(InvoiceEntities_1.InvoiceEntity, `${Entities_1.Entities.INVOICE}`, `${Entities_1.Entities.INVOICE}.id = ${Entities_1.Entities.PAYMENT}.payment_invoice_id`)
                .leftJoin(OrderEntities_1.OrderEntity, `${Entities_1.Entities.ORDER}`, `${Entities_1.Entities.ORDER}.id = ${Entities_1.Entities.INVOICE}.invoice_order_id`)
                .leftJoin(CustomerEntities_1.CustomerEntity, `${Entities_1.Entities.CUSTOMER}`, `${Entities_1.Entities.CUSTOMER}.id = ${Entities_1.Entities.ORDER}.customer_id`)
                .leftJoin(UserEntities_1.UserEntity, `${Entities_1.Entities.USER}`, `${Entities_1.Entities.USER}.id = ${Entities_1.Entities.CUSTOMER}.user_id`)
                .leftJoin(RoleEntities_1.RoleEntity, `${Entities_1.Entities.ROLES}`, `${Entities_1.Entities.ROLES}.id = ${Entities_1.Entities.USER}.role_id`);
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
                        let from = Entities_1.Entities.PAYMENT;
                        if (v.id === 'si_number')
                            from = Entities_1.Entities.ORDER;
                        else if (v.id === 'name')
                            from = Entities_1.Entities.USER;
                        else if (v.id === 'invoice_code')
                            from = Entities_1.Entities.INVOICE;
                        query = query.andWhere(`UPPER(${from}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
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
            console.log('Error Dao: Query for getPaymentDao Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const getPaymentHistory = (payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            let defaultSort = Entities_1.Entities.PAYMENT + '.' + 'payment_date';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            const o = Schema_1.useSchemaAndTableName(Entities_1.Entities.PAYMENT);
            let query = typeorm_1.getManager()
                .createQueryBuilder()
                .select(`${Entities_1.Entities.PAYMENT}.id`, 'id')
                .addSelect(`${Entities_1.Entities.USER}.name`, 'name')
                .addSelect(`${Entities_1.Entities.USER}.address`, 'address')
                .addSelect(`${Entities_1.Entities.CUSTOMER}.customer_area`, 'customer_area')
                .addSelect(`${Entities_1.Entities.ORDER}.si_number`, 'si_number')
                .addSelect(`${Entities_1.Entities.ORDER}.order_date`, 'order_date')
                .addSelect(`${Entities_1.Entities.INVOICE}.invoice_code`, 'invoice_code')
                .addSelect(`${Entities_1.Entities.INVOICE}.total_order`, 'total_order')
                .addSelect(`${Entities_1.Entities.PAYMENT}.payment_invoice_id`, 'payment_invoice_id')
                .addSelect(`${Entities_1.Entities.PAYMENT}.payment_amount`, 'payment_amount')
                .addSelect(`${Entities_1.Entities.PAYMENT}.payment_balance`, 'payment_balance')
                .addSelect(`${Entities_1.Entities.PAYMENT}.over_payment`, 'over_payment')
                .addSelect(`${Entities_1.Entities.PAYMENT}.account_balance`, 'account_balance')
                .addSelect(`${Entities_1.Entities.PAYMENT}.payment_date`, 'payment_date')
                .addSelect(`${Entities_1.Entities.PAYMENT}.previous_over_payment`, 'previous_over_payment')
                .addSelect(`${Entities_1.Entities.PAYMENT}.recent`, 'recent')
                .addSelect(`${Entities_1.Entities.PAYMENT}.description`, 'description')
                .from(o, Entities_1.Entities.PAYMENT)
                .leftJoin(InvoiceEntities_1.InvoiceEntity, `${Entities_1.Entities.INVOICE}`, `${Entities_1.Entities.INVOICE}.id = ${Entities_1.Entities.PAYMENT}.payment_invoice_id`)
                .leftJoin(OrderEntities_1.OrderEntity, `${Entities_1.Entities.ORDER}`, `${Entities_1.Entities.ORDER}.id = ${Entities_1.Entities.INVOICE}.invoice_order_id`)
                .leftJoin(CustomerEntities_1.CustomerEntity, `${Entities_1.Entities.CUSTOMER}`, `${Entities_1.Entities.CUSTOMER}.id = ${Entities_1.Entities.ORDER}.customer_id`)
                .leftJoin(UserEntities_1.UserEntity, `${Entities_1.Entities.USER}`, `${Entities_1.Entities.USER}.id = ${Entities_1.Entities.CUSTOMER}.user_id`)
                .where(`payment_invoice_id = '${payload[0].payment_invoice_id}'`);
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
                        let from = Entities_1.Entities.PAYMENT;
                        if (v.id === 'si_number')
                            from = Entities_1.Entities.ORDER;
                        else if (v.id === 'name')
                            from = Entities_1.Entities.USER;
                        query = query.andWhere(`UPPER(${from}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
                    }
                });
            }
            const count = yield query.getCount();
            query
                .offset(pagination.skip)
                .limit(pagination.take)
                .orderBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'ASC');
            const results = yield query.getRawMany();
            const total = count;
            let pageCount = Math.ceil(total / pagination.take) || 1;
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success]), { message: 'Successfully Retrieved data.', results, pagination: { total, current: pagination.current, pageCount } });
        }
        catch (err) {
            console.log('Error Dao: Query for getPaymentDao Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const createPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let o_id = '';
            const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield transactionEntityManager
                        .getRepository(PaymentEntities_1.PaymentEntity)
                        .createQueryBuilder(Entities_1.Entities.PAYMENT)
                        .update(PaymentEntities_1.PaymentEntity)
                        .set({
                        recent: 'N'
                    })
                        .where('payment_invoice_id = :id', { id: payload.payment_invoice_id })
                        .execute();
                    const data = yield transactionEntityManager.getRepository(PaymentEntities_1.PaymentEntity).createQueryBuilder(Entities_1.Entities.PAYMENT).insert().into(PaymentEntities_1.PaymentEntity).values(payload).execute();
                    let { id } = data.identifiers[0];
                    o_id = id;
                    yield transactionEntityManager
                        .getRepository(CustomerEntities_1.CustomerEntity)
                        .createQueryBuilder(Entities_1.Entities.CUSTOMER)
                        .update(CustomerEntities_1.CustomerEntity)
                        .set({
                        customer_balance: payload.account_balance,
                        customer_over_payment: payload.over_payment,
                        customer_payment_status: payload.customer_payment_status,
                        customer_status: payload.customer_payment_status
                    })
                        .where('id = :id', { id: payload.customer_id })
                        .execute();
                    yield transactionEntityManager
                        .getRepository(OrderEntities_1.OrderEntity)
                        .createQueryBuilder(Entities_1.Entities.ORDER)
                        .update(OrderEntities_1.OrderEntity)
                        .set({
                        order_status: payload.order_status,
                        payment_status: payload.payment_status
                    })
                        .where(`id = :id`, { id: payload.order_id })
                        .execute();
                    return true;
                }
                catch (err) {
                    console.log('Error Dao: Create Payment Dao Transaction -> ', err);
                    return false;
                }
            }));
            if (transaction) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Created]), { o_id, message: 'Successfully created.' });
            }
            else {
                console.log('Error Dao: Create Payment Transaction -> ', 'Error Creating Payment!');
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: 'Error Creating Payment!' });
            }
        }
        catch (err) {
            console.log('Error Dao: Create Payment Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const updatePayment = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('----------payment-------controller-=-----------');
            console.log(id);
            console.log(payload);
            console.log('----------payment-------controller-=-----------');
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Updated]), { message: 'Successfully updated.' });
        }
        catch (err) {
            console.log('Error Dao: update Payment -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const deletePayment = (id, _payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transaction = yield typeorm_1.getManager().transaction((_transactionEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    let i = id.split('|');
                    console.log('----------------------------');
                    console.log(id);
                    console.log(i);
                    console.log('----------------------------');
                    return true;
                }
                catch (err) {
                    console.log('Error Dao: Create Payment Dao Transaction -> ', err);
                    return false;
                }
            }));
            if (transaction) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Deleted]), { message: 'Successfully deleted.' });
            }
            else {
                console.log('Error Dao: Delete Payment Transaction -> ', 'Error Delete Payment!');
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: 'Error Delete Payment!' });
            }
        }
        catch (err) {
            console.log('Error Dao: delete Payment -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const deletePaymentHistory = (id, _payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    let i = id.split('|');
                    const nextRecentPayment = yield transactionEntityManager
                        .getRepository(PaymentEntities_1.PaymentEntity)
                        .createQueryBuilder(Entities_1.Entities.PAYMENT)
                        .leftJoinAndMapOne(`${Entities_1.Entities.PAYMENT}.payment_invoice`, InvoiceEntities_1.InvoiceEntity, `${Entities_1.Entities.INVOICE}`, `${Entities_1.Entities.INVOICE}.id = ${Entities_1.Entities.PAYMENT}.payment_invoice_id`)
                        .leftJoinAndMapOne(`${Entities_1.Entities.INVOICE}.invoice_order`, OrderEntities_1.OrderEntity, `${Entities_1.Entities.ORDER}`, `${Entities_1.Entities.ORDER}.id = ${Entities_1.Entities.INVOICE}.invoice_order_id`)
                        .leftJoinAndMapOne(`${Entities_1.Entities.ORDER}.order_customer`, CustomerEntities_1.CustomerEntity, `${Entities_1.Entities.CUSTOMER}`, `${Entities_1.Entities.CUSTOMER}.id = ${Entities_1.Entities.ORDER}.customer_id`)
                        .where('payment_invoice_id = :id', { id: i[1] })
                        .limit(1)
                        .offset(1)
                        .orderBy('payment_date', 'DESC')
                        .getOne();
                    if (nextRecentPayment && nextRecentPayment !== undefined) {
                        let order_id = nextRecentPayment === null || nextRecentPayment === void 0 ? void 0 : nextRecentPayment.payment_invoice.invoice_order.id;
                        let customer_id = nextRecentPayment === null || nextRecentPayment === void 0 ? void 0 : nextRecentPayment.payment_invoice.invoice_order.order_customer.id;
                        yield transactionEntityManager
                            .getRepository(OrderEntities_1.OrderEntity)
                            .createQueryBuilder(Entities_1.Entities.ORDER)
                            .update(OrderEntities_1.OrderEntity)
                            .set({
                            order_status: 'Partial Payment'
                        })
                            .where('id = :id', { id: order_id })
                            .execute();
                        yield transactionEntityManager
                            .getRepository(CustomerEntities_1.CustomerEntity)
                            .createQueryBuilder(Entities_1.Entities.CUSTOMER)
                            .update(CustomerEntities_1.CustomerEntity)
                            .set({
                            customer_balance: nextRecentPayment.account_balance,
                            customer_over_payment: 0,
                            customer_status: 'Partial Payment'
                        })
                            .where('id = :id', { id: customer_id })
                            .execute();
                        yield transactionEntityManager
                            .getRepository(PaymentEntities_1.PaymentEntity)
                            .createQueryBuilder(Entities_1.Entities.PAYMENT)
                            .update(PaymentEntities_1.PaymentEntity)
                            .set({
                            recent: 'Y'
                        })
                            .where('id = :id', { id: nextRecentPayment.id })
                            .execute();
                        yield transactionEntityManager.getRepository(PaymentEntities_1.PaymentEntity).delete({ id: i[0] });
                    }
                    else {
                        const currentPayment = yield transactionEntityManager
                            .getRepository(PaymentEntities_1.PaymentEntity)
                            .createQueryBuilder(Entities_1.Entities.PAYMENT)
                            .leftJoinAndMapOne(`${Entities_1.Entities.PAYMENT}.payment_invoice`, InvoiceEntities_1.InvoiceEntity, `${Entities_1.Entities.INVOICE}`, `${Entities_1.Entities.INVOICE}.id = ${Entities_1.Entities.PAYMENT}.payment_invoice_id`)
                            .leftJoinAndMapOne(`${Entities_1.Entities.INVOICE}.invoice_order`, OrderEntities_1.OrderEntity, `${Entities_1.Entities.ORDER}`, `${Entities_1.Entities.ORDER}.id = ${Entities_1.Entities.INVOICE}.invoice_order_id`)
                            .leftJoinAndMapOne(`${Entities_1.Entities.ORDER}.order_customer`, CustomerEntities_1.CustomerEntity, `${Entities_1.Entities.CUSTOMER}`, `${Entities_1.Entities.CUSTOMER}.id = ${Entities_1.Entities.ORDER}.customer_id`)
                            .where(`${Entities_1.Entities.PAYMENT}.id = :id`, { id: i[0] })
                            .getOne();
                        let order_id = currentPayment === null || currentPayment === void 0 ? void 0 : currentPayment.payment_invoice.invoice_order.id;
                        let customer_id = currentPayment === null || currentPayment === void 0 ? void 0 : currentPayment.payment_invoice.invoice_order.order_customer.id;
                        yield transactionEntityManager
                            .getRepository(OrderEntities_1.OrderEntity)
                            .createQueryBuilder(Entities_1.Entities.ORDER)
                            .update(OrderEntities_1.OrderEntity)
                            .set({
                            order_status: 'For Payment'
                        })
                            .where('id = :id', { id: order_id })
                            .execute();
                        yield transactionEntityManager
                            .getRepository(CustomerEntities_1.CustomerEntity)
                            .createQueryBuilder(Entities_1.Entities.CUSTOMER)
                            .update(CustomerEntities_1.CustomerEntity)
                            .set({
                            customer_balance: currentPayment === null || currentPayment === void 0 ? void 0 : currentPayment.payment_balance,
                            customer_over_payment: currentPayment === null || currentPayment === void 0 ? void 0 : currentPayment.previous_over_payment,
                            customer_status: 'Pending Payment'
                        })
                            .where('id = :id', { id: customer_id })
                            .execute();
                        yield transactionEntityManager.getRepository(PaymentEntities_1.PaymentEntity).delete({ id: i[0] });
                    }
                    return true;
                }
                catch (err) {
                    console.log('Error Dao: Create Payment Dao Transaction -> ', err);
                    return false;
                }
            }));
            if (transaction) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Deleted]), { message: 'Successfully deleted.' });
            }
            else {
                console.log('Error Dao: Delete Payment Transaction -> ', 'Error Delete Payment!');
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: 'Error Delete Payment!' });
            }
        }
        catch (err) {
            console.log('Error Dao: delete Payment -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const restorePayment = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield typeorm_1.getRepository(PaymentEntities_1.PaymentEntity)
                .createQueryBuilder(Entities_1.Entities.PAYMENT)
                .update(PaymentEntities_1.PaymentEntity)
                .set(Object.assign(Object.assign({}, payload), { updated_at: new Date() }))
                .where('id = :id', { id })
                .execute();
            yield typeorm_1.getRepository(PaymentEntities_1.PaymentEntity).restore({ id });
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Restored]), { message: 'Successfully restored.' });
        }
        catch (err) {
            console.log('Error Dao: restorePayment -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    return {
        getPayment,
        getPaymentHistory,
        createPayment,
        updatePayment,
        deletePayment,
        deletePaymentHistory,
        restorePayment
    };
};
//# sourceMappingURL=PaymentDao.js.map
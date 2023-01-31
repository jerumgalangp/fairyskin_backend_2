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
exports.useInvoiceDao = void 0;
const typeorm_1 = require("typeorm");
const HttpConstant_1 = require("../constant/HttpConstant");
const InvoiceEntities_1 = require("../entities/InvoiceEntities");
const Entities_1 = require("./../constant/Entities");
const CustomerEntities_1 = require("./../entities/CustomerEntities");
const InvoicePendingEntities_1 = require("./../entities/InvoicePendingEntities");
const OrderEntities_1 = require("./../entities/OrderEntities");
const RoleEntities_1 = require("./../entities/RoleEntities");
const UserEntities_1 = require("./../entities/UserEntities");
const Schema_1 = require("./../util/Schema");
exports.useInvoiceDao = () => {
    const getAllInvoice = (_payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            if (!defaultSort.includes('.')) {
                defaultSort = Entities_1.Entities.INVOICE + '.' + defaultSort;
            }
            let query = typeorm_1.getRepository(InvoiceEntities_1.InvoiceEntity).createQueryBuilder(Entities_1.Entities.INVOICE);
            if (headers.filters !== undefined && ((_a = headers.filters) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                let filters = JSON.parse(headers.filters);
                filters.map((v) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like :q`, { q: `%${v.value.toUpperCase()}%` });
                    }
                    else {
                        query = query.andWhere(`UPPER(${Entities_1.Entities.INVOICE}.${v.id}) Like :q`, { q: `%${v.value.toUpperCase()}%` });
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
            console.log('Error Dao: Query for getInvoiceDao Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const getInvoice = (payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            let defaultSort = 'created_at';
            let where = '';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            if (!defaultSort.includes('.')) {
                if (defaultSort === 'si_number') {
                    defaultSort = Entities_1.Entities.ORDER + '.' + defaultSort;
                }
                else if (defaultSort === 'name') {
                    defaultSort = Entities_1.Entities.USER + '.' + defaultSort;
                }
                else {
                    defaultSort = Entities_1.Entities.INVOICE + '.' + defaultSort;
                }
            }
            if (payload.length > 0) {
                if (payload[0].order_status !== undefined) {
                    where = `${Entities_1.Entities.ORDER}.order_status like '${payload[0].order_status._value}'`;
                }
                else
                    where = `invoice_code = '${payload[0].invoice_code}'`;
            }
            let query = typeorm_1.getManager()
                .createQueryBuilder()
                .select(`${Entities_1.Entities.INVOICE}.id`, 'id')
                .addSelect('invoice_code', 'invoice_code')
                .addSelect('invoice_date', 'invoice_date')
                .addSelect('discount', 'discount')
                .addSelect('total_order', 'total_order')
                .addSelect('down_payment', 'down_payment')
                .addSelect('delivery_fee', 'delivery_fee')
                .addSelect('shipping_details', 'shipping_details')
                .addSelect('carrier', 'carrier')
                .addSelect('special_note', 'special_note')
                .addSelect('est_weight', 'est_weight')
                .addSelect(`${Entities_1.Entities.INVOICE}.amount_to_pay`, 'amount_to_pay')
                .addSelect(`${Entities_1.Entities.INVOICE}.over_payment`, 'over_payment')
                .addSelect(`${Entities_1.Entities.INVOICE}.approval_ind`, 'approval_ind')
                .addSelect(`${Entities_1.Entities.INVOICE}.reference_value`, 'reference_value')
                .addSelect(`${Entities_1.Entities.ORDER}.id`, 'invoice_order_id')
                .addSelect(`${Entities_1.Entities.ORDER}.si_number`, 'si_number')
                .addSelect(`${Entities_1.Entities.ORDER}.order_status`, 'order_status')
                .addSelect(`${Entities_1.Entities.USER}.name`, 'name')
                .addSelect(`${Entities_1.Entities.USER}.contact_number`, 'contact_number')
                .addSelect(`${Entities_1.Entities.USER}.address`, 'address')
                .addSelect(`${Entities_1.Entities.ROLES}.role_description`, 'role')
                .addSelect(`${Entities_1.Entities.CUSTOMER}.customer_over_payment`, 'customer_over_payment')
                .addSelect(`${Entities_1.Entities.CUSTOMER}.customer_balance`, 'customer_balance')
                .addSelect(`${Entities_1.Entities.CUSTOMER}.id`, 'customer_id')
                .from(Schema_1.useSchemaAndTableName(Entities_1.Entities.INVOICE), Entities_1.Entities.INVOICE)
                .leftJoin(OrderEntities_1.OrderEntity, `${Entities_1.Entities.ORDER}`, `${Entities_1.Entities.ORDER}.id = ${Entities_1.Entities.INVOICE}.invoice_order_id`)
                .leftJoin(CustomerEntities_1.CustomerEntity, `${Entities_1.Entities.CUSTOMER}`, `${Entities_1.Entities.CUSTOMER}.id = ${Entities_1.Entities.ORDER}.customer_id`)
                .leftJoin(UserEntities_1.UserEntity, `${Entities_1.Entities.USER}`, `${Entities_1.Entities.USER}.id = ${Entities_1.Entities.CUSTOMER}.user_id`)
                .leftJoin(RoleEntities_1.RoleEntity, `${Entities_1.Entities.ROLES}`, `${Entities_1.Entities.ROLES}.id = ${Entities_1.Entities.USER}.role_id`)
                .where(where);
            if (headers.filters !== undefined && ((_b = headers.filters) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                let filters = JSON.parse(headers.filters);
                filters.map((v) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like '%${v.value.toUpperCase()}%' `);
                    }
                    else {
                        query = query.andWhere(`UPPER(${Entities_1.Entities.INVOICE}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
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
            console.log('Error Dao: Query for getInvoiceDao Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const createInvoice = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let Invoice_id;
            const userExist = yield typeorm_1.getRepository(InvoiceEntities_1.InvoiceEntity).createQueryBuilder(Entities_1.Entities.INVOICE).where(`UPPER(Invoice_name) = UPPER('${payload.invoice_code}')`).getMany();
            if (userExist.length > 0) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `User ${payload.invoice_code.toUpperCase()} already exist!` });
            }
            const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const data = yield transactionEntityManager.getRepository(InvoiceEntities_1.InvoiceEntity).createQueryBuilder(Entities_1.Entities.INVOICE).insert().into(InvoiceEntities_1.InvoiceEntity).values(payload).execute();
                    let { id } = data.identifiers[0];
                    Invoice_id = id;
                    return true;
                }
                catch (err) {
                    console.log('Error Dao: Deleting ewt Dao Transaction -> ', err);
                    return false;
                }
            }));
            if (transaction) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Created]), { Invoice_id, message: 'Successfully created.' });
            }
            else {
                console.log('Error Dao: Create Invoice Transaction -> ', 'Error Creating Invoice!');
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: 'Error Creating Invoice!' });
            }
        }
        catch (err) {
            console.log('Error Dao: Create Invoice Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const updateInvoice = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = typeorm_1.getRepository(InvoiceEntities_1.InvoiceEntity).createQueryBuilder(Entities_1.Entities.INVOICE).update(InvoiceEntities_1.InvoiceEntity).set(payload).where('id = :id', { id });
            yield query.execute();
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Updated]), { message: 'Successfully updated.' });
        }
        catch (err) {
            console.log('Error Dao: update Invoice -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const deleteInvoice = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield typeorm_1.getRepository(InvoiceEntities_1.InvoiceEntity).createQueryBuilder(Entities_1.Entities.INVOICE).update(InvoiceEntities_1.InvoiceEntity).set(payload).where('id = :id', { id }).execute();
            yield typeorm_1.getRepository(InvoiceEntities_1.InvoiceEntity).delete({ id });
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Deleted]), { message: 'Successfully deleted.' });
        }
        catch (err) {
            console.log('Error Dao: delete Invoice -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const getInvoicePending = (payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        try {
            let defaultSort = 'request_date';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            if (!defaultSort.includes('.')) {
                if (defaultSort === 'si_number') {
                    defaultSort = Entities_1.Entities.ORDER + '.' + defaultSort;
                }
                else if (defaultSort === 'name') {
                    defaultSort = Entities_1.Entities.USER + '.' + defaultSort;
                }
                else {
                    defaultSort = Entities_1.Entities.INVOICE_PENDING + '.' + defaultSort;
                }
            }
            let where = '';
            if (payload.length > 0) {
                let date_from = payload[0];
                let date_to = payload[1];
                if (date_from !== undefined && date_to !== undefined) {
                    where = `DATE(${Entities_1.Entities.INVOICE_PENDING}.invoice_date) BETWEEN DATE('${date_from.df._value}') AND DATE('${date_to.dt._value}')`;
                }
            }
            let query = typeorm_1.getManager()
                .createQueryBuilder()
                .select(`${Entities_1.Entities.INVOICE_PENDING}.id`, 'id')
                .addSelect(`${Entities_1.Entities.INVOICE_PENDING}.invoice_code`, 'invoice_code')
                .addSelect(`TO_CHAR(${Entities_1.Entities.INVOICE_PENDING}.invoice_date, 'MM/DD/YYYY')`, 'invoice_date')
                .addSelect(`${Entities_1.Entities.INVOICE_PENDING}.discount`, 'discount')
                .addSelect(`${Entities_1.Entities.INVOICE_PENDING}.total_order`, 'total_order')
                .addSelect(`${Entities_1.Entities.INVOICE}.total_order`, 'original_total_order')
                .addSelect(`${Entities_1.Entities.INVOICE_PENDING}.request_by`, 'request_by')
                .addSelect(`TO_CHAR(${Entities_1.Entities.INVOICE_PENDING}.request_date, 'MM/DD/YYYY')`, 'request_date')
                .addSelect(`${Entities_1.Entities.INVOICE_PENDING}.event_request`, 'event_request')
                .addSelect(`${Entities_1.Entities.INVOICE_PENDING}.down_payment`, 'down_payment')
                .addSelect(`${Entities_1.Entities.INVOICE_PENDING}.delivery_fee`, 'delivery_fee')
                .addSelect(`${Entities_1.Entities.INVOICE_PENDING}.shipping_details`, 'shipping_details')
                .addSelect(`${Entities_1.Entities.INVOICE_PENDING}.carrier`, 'carrier')
                .addSelect(`${Entities_1.Entities.INVOICE_PENDING}.special_note`, 'special_note')
                .addSelect(`${Entities_1.Entities.INVOICE_PENDING}.est_weight`, 'est_weight')
                .addSelect(`${Entities_1.Entities.INVOICE_PENDING}.amount_to_pay`, 'amount_to_pay')
                .addSelect(`${Entities_1.Entities.INVOICE_PENDING}.over_payment`, 'over_payment')
                .addSelect(`${Entities_1.Entities.INVOICE_PENDING}.approval_ind`, 'approval_ind')
                .addSelect(`${Entities_1.Entities.INVOICE_PENDING}.reference_value`, 'reference_value')
                .addSelect(`${Entities_1.Entities.INVOICE_PENDING}.invoice_order_id`, 'invoice_order_id')
                .addSelect(`${Entities_1.Entities.ORDER}.si_number`, 'si_number')
                .addSelect(`${Entities_1.Entities.USER}.name`, 'name')
                .addSelect(`${Entities_1.Entities.USER}.contact_number`, 'contact_number')
                .addSelect(`${Entities_1.Entities.USER}.address`, 'address')
                .addSelect(`${Entities_1.Entities.ROLES}.role_description`, 'role')
                .from(Schema_1.useSchemaAndTableName(Entities_1.Entities.INVOICE_PENDING), Entities_1.Entities.INVOICE_PENDING)
                .leftJoin(OrderEntities_1.OrderEntity, `${Entities_1.Entities.ORDER}`, `${Entities_1.Entities.ORDER}.id = ${Entities_1.Entities.INVOICE_PENDING}.invoice_order_id`)
                .leftJoin(InvoiceEntities_1.InvoiceEntity, `${Entities_1.Entities.INVOICE}`, `${Entities_1.Entities.INVOICE}.reference_value = ${Entities_1.Entities.INVOICE_PENDING}.reference_value`)
                .leftJoin(CustomerEntities_1.CustomerEntity, `${Entities_1.Entities.CUSTOMER}`, `${Entities_1.Entities.CUSTOMER}.id = ${Entities_1.Entities.ORDER}.customer_id`)
                .leftJoin(UserEntities_1.UserEntity, `${Entities_1.Entities.USER}`, `${Entities_1.Entities.USER}.id = ${Entities_1.Entities.CUSTOMER}.user_id`)
                .leftJoin(RoleEntities_1.RoleEntity, `${Entities_1.Entities.ROLES}`, `${Entities_1.Entities.ROLES}.id = ${Entities_1.Entities.USER}.role_id`)
                .where(where);
            if (headers.filters !== undefined && ((_c = headers.filters) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                let filters = JSON.parse(headers.filters);
                filters.map((v) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like '%${v.value.toUpperCase()}%' `);
                    }
                    else {
                        query = query.andWhere(`UPPER(${v.id}) Like '%${v.value.toUpperCase()}%' `);
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
            console.log('Error Dao: Query for getInvoiceDao Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const createInvoicePending = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const InvoicePendingExist = yield typeorm_1.getRepository(InvoicePendingEntities_1.InvoicePendingEntity).createQueryBuilder(Entities_1.Entities.INVOICE_PENDING).where(`invoice_order_id = '${payload.invoice_order_id}'`).getMany();
            const InvoiceExist = yield typeorm_1.getRepository(InvoiceEntities_1.InvoiceEntity).createQueryBuilder(Entities_1.Entities.INVOICE).where(`invoice_order_id = '${payload.invoice_order_id}'`).getMany();
            if (InvoiceExist.length > 0 || InvoicePendingExist.length > 0) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `SI ${payload.si_number.toUpperCase()} is already pending for approval!` });
            }
            let i_id;
            const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const data = yield transactionEntityManager
                        .getRepository(InvoicePendingEntities_1.InvoicePendingEntity)
                        .createQueryBuilder(Entities_1.Entities.INVOICE_PENDING)
                        .insert()
                        .into(InvoicePendingEntities_1.InvoicePendingEntity)
                        .values(payload)
                        .execute();
                    let { id } = data.identifiers[0];
                    i_id = id;
                    yield transactionEntityManager
                        .getRepository(OrderEntities_1.OrderEntity)
                        .createQueryBuilder(Entities_1.Entities.ORDER)
                        .update(OrderEntities_1.OrderEntity)
                        .set({
                        order_status: 'Invoice is Pending for Approval'
                    })
                        .where('id = :id', { id: payload.invoice_order_id })
                        .execute();
                    return true;
                }
                catch (err) {
                    console.log('Error Dao: Create Invoice Dao Transaction -> ', err);
                    return false;
                }
            }));
            if (transaction) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Created]), { i_id, message: 'Successfully submitted for approval.' });
            }
            else {
                console.log('Error Dao: Create Invoice Transaction -> ', 'Error Creating Invoice Transaction!');
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: 'Error Creating Invoice!' });
            }
        }
        catch (err) {
            console.log('Error Dao: Create Invoice Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const updateInvoicePending = (_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const InvoicePendingExist = yield typeorm_1.getRepository(InvoicePendingEntities_1.InvoicePendingEntity)
                .createQueryBuilder(Entities_1.Entities.INVOICE_PENDING)
                .where(`UPPER(invoice_code) = UPPER('${payload.invoice_code}')`)
                .getMany();
            if (InvoicePendingExist.length > 0) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `Invoice ${payload.invoice_code.toUpperCase()} is already pending for approval!` });
            }
            const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield transactionEntityManager
                        .getRepository(InvoiceEntities_1.InvoiceEntity)
                        .createQueryBuilder(Entities_1.Entities.INVOICE)
                        .update(InvoiceEntities_1.InvoiceEntity)
                        .set({ approval_ind: 'Y' })
                        .where('reference_value = :reference_value', { reference_value: payload.reference_value })
                        .execute();
                    yield transactionEntityManager.getRepository(InvoicePendingEntities_1.InvoicePendingEntity).createQueryBuilder(Entities_1.Entities.INVOICE_PENDING).insert().into(InvoicePendingEntities_1.InvoicePendingEntity).values(payload).execute();
                    yield transactionEntityManager
                        .getRepository(OrderEntities_1.OrderEntity)
                        .createQueryBuilder(Entities_1.Entities.ORDER)
                        .update(OrderEntities_1.OrderEntity)
                        .set({
                        order_status: 'Invoice is Pending for Approval'
                    })
                        .where('id = :id', { id: payload.invoice_order_id })
                        .execute();
                    return true;
                }
                catch (err) {
                    console.log('Error in ${payload.status} Invoice Pending Dao Transaction -> ', err);
                    return false;
                }
            }));
            if (transaction) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Updated]), { message: 'Successfully submitted for approval.' });
            }
            else {
                console.log('Error Dao: Rejecting Invoice Pending Transaction -> ', `Error in Invoice Pending!`);
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `Error in Invoice Pending!` });
            }
        }
        catch (err) {
            console.log('Error Dao: Update Invoice Pending -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const deleteInvoicePending = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const invoicePendingExist = yield typeorm_1.getRepository(InvoicePendingEntities_1.InvoicePendingEntity).createQueryBuilder(Entities_1.Entities.INVOICE_PENDING).where(`UPPER(reference_value) = UPPER('${id}')`).getMany();
            if (invoicePendingExist.length > 0) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `Invoice ${invoicePendingExist[0].invoice_code.toUpperCase()} is already pending for approval!` });
            }
            const invoiceMain = yield typeorm_1.getRepository(InvoiceEntities_1.InvoiceEntity).createQueryBuilder(Entities_1.Entities.INVOICE).where(`UPPER(reference_value) = UPPER('${id}')`).getOne();
            const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield transactionEntityManager
                        .getRepository(InvoiceEntities_1.InvoiceEntity)
                        .createQueryBuilder(Entities_1.Entities.INVOICE)
                        .update(InvoiceEntities_1.InvoiceEntity)
                        .set({ approval_ind: 'Y' })
                        .where('reference_value = :reference_value', { reference_value: id })
                        .execute();
                    yield transactionEntityManager
                        .getRepository(OrderEntities_1.OrderEntity)
                        .createQueryBuilder(Entities_1.Entities.ORDER)
                        .update(OrderEntities_1.OrderEntity)
                        .set({
                        order_status: 'Invoice is Pending for Approval'
                    })
                        .where('id = :id', { id: invoiceMain === null || invoiceMain === void 0 ? void 0 : invoiceMain.invoice_order_id })
                        .execute();
                    yield transactionEntityManager
                        .getRepository(InvoicePendingEntities_1.InvoicePendingEntity)
                        .createQueryBuilder(Entities_1.Entities.INVOICE_PENDING)
                        .insert()
                        .into(InvoicePendingEntities_1.InvoicePendingEntity)
                        .values({
                        invoice_code: invoiceMain === null || invoiceMain === void 0 ? void 0 : invoiceMain.invoice_code,
                        invoice_date: invoiceMain === null || invoiceMain === void 0 ? void 0 : invoiceMain.invoice_date,
                        discount: invoiceMain === null || invoiceMain === void 0 ? void 0 : invoiceMain.discount,
                        total_order: invoiceMain === null || invoiceMain === void 0 ? void 0 : invoiceMain.total_order,
                        amount_to_pay: invoiceMain === null || invoiceMain === void 0 ? void 0 : invoiceMain.amount_to_pay,
                        over_payment: invoiceMain === null || invoiceMain === void 0 ? void 0 : invoiceMain.over_payment,
                        approval_ind: 'N',
                        reference_value: id,
                        invoice_order_id: invoiceMain === null || invoiceMain === void 0 ? void 0 : invoiceMain.invoice_order_id,
                        est_weight: invoiceMain === null || invoiceMain === void 0 ? void 0 : invoiceMain.est_weight,
                        special_note: invoiceMain === null || invoiceMain === void 0 ? void 0 : invoiceMain.special_note,
                        shipping_details: invoiceMain === null || invoiceMain === void 0 ? void 0 : invoiceMain.shipping_details,
                        transportation: invoiceMain === null || invoiceMain === void 0 ? void 0 : invoiceMain.transportation,
                        carrier: invoiceMain === null || invoiceMain === void 0 ? void 0 : invoiceMain.carrier,
                        delivery_fee: invoiceMain === null || invoiceMain === void 0 ? void 0 : invoiceMain.delivery_fee,
                        down_payment: invoiceMain === null || invoiceMain === void 0 ? void 0 : invoiceMain.down_payment,
                        request_by: payload.request_by,
                        event_request: payload.event_request,
                        request_date: payload.request_date
                    })
                        .execute();
                    return true;
                }
                catch (err) {
                    console.log('Error Invoice Pending Dao Transaction -> ', err);
                    return false;
                }
            }));
            if (transaction) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Deleted]), { message: 'Successfully submitted for approval.' });
            }
            else {
                console.log('Error Dao: Rejecting Invoice Pending Transaction -> ', `Error in Invoice Pending!`);
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `Error in Invoice Pending!` });
            }
        }
        catch (err) {
            console.log('Error Dao: delete Invoice -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const approvalInvoicePending = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    if (payload.status === 'Rejected') {
                        if (payload.event_request === 'Modify' || payload.event_request === 'Delete') {
                            yield transactionEntityManager
                                .getRepository(InvoiceEntities_1.InvoiceEntity)
                                .createQueryBuilder(Entities_1.Entities.INVOICE)
                                .update(InvoiceEntities_1.InvoiceEntity)
                                .set({
                                approval_ind: 'N'
                            })
                                .where('reference_value = :reference_value', { reference_value: payload.reference_value })
                                .execute();
                            yield transactionEntityManager
                                .getRepository(OrderEntities_1.OrderEntity)
                                .createQueryBuilder(Entities_1.Entities.ORDER)
                                .update(OrderEntities_1.OrderEntity)
                                .set({
                                order_status: 'For Payment'
                            })
                                .where('id = :id', { id: payload.invoice_order_id })
                                .execute();
                        }
                        else {
                            yield transactionEntityManager
                                .getRepository(OrderEntities_1.OrderEntity)
                                .createQueryBuilder(Entities_1.Entities.ORDER)
                                .update(OrderEntities_1.OrderEntity)
                                .set({
                                order_status: 'For Invoice'
                            })
                                .where('id = :id', { id: payload.invoice_order_id })
                                .execute();
                        }
                    }
                    else {
                        const CustomerID = yield transactionEntityManager
                            .getRepository(OrderEntities_1.OrderEntity)
                            .createQueryBuilder(Entities_1.Entities.ORDER)
                            .where('id = :id', { id: payload.invoice_order_id })
                            .getOne();
                        if (payload.event_request === 'Add') {
                            const InvoicePending = yield transactionEntityManager
                                .getRepository(InvoicePendingEntities_1.InvoicePendingEntity)
                                .createQueryBuilder(Entities_1.Entities.INVOICE_PENDING)
                                .where('id = :id', { id })
                                .getOne();
                            let data = {
                                invoice_code: InvoicePending.invoice_code,
                                invoice_date: InvoicePending.invoice_date,
                                discount: InvoicePending.discount,
                                total_order: InvoicePending.total_order,
                                amount_to_pay: InvoicePending.amount_to_pay,
                                over_payment: InvoicePending.over_payment,
                                approval_ind: 'N',
                                created_by: InvoicePending.request_by,
                                reference_value: InvoicePending.reference_value,
                                invoice_order_id: InvoicePending.invoice_order_id,
                                est_weight: InvoicePending.est_weight,
                                special_note: InvoicePending.special_note,
                                shipping_details: InvoicePending.shipping_details,
                                transportation: InvoicePending.transportation,
                                carrier: InvoicePending.carrier,
                                delivery_fee: InvoicePending.delivery_fee,
                                down_payment: InvoicePending.down_payment
                            };
                            yield transactionEntityManager.getRepository(InvoiceEntities_1.InvoiceEntity).createQueryBuilder(Entities_1.Entities.INVOICE).insert().into(InvoiceEntities_1.InvoiceEntity).values(data).execute();
                            yield transactionEntityManager
                                .getRepository(OrderEntities_1.OrderEntity)
                                .createQueryBuilder(Entities_1.Entities.ORDER)
                                .update(OrderEntities_1.OrderEntity)
                                .set({
                                order_status: 'For Payment'
                            })
                                .where('id = :id', { id: payload.invoice_order_id })
                                .execute();
                            yield transactionEntityManager
                                .getRepository(CustomerEntities_1.CustomerEntity)
                                .createQueryBuilder(Entities_1.Entities.CUSTOMER)
                                .update(CustomerEntities_1.CustomerEntity)
                                .set({
                                customer_balance: InvoicePending.total_order,
                                customer_status: 'Pending Payment'
                            })
                                .where('id = :id', { id: CustomerID.customer_id })
                                .execute();
                        }
                        else if (payload.event_request === 'Modify') {
                            yield transactionEntityManager
                                .getRepository(InvoiceEntities_1.InvoiceEntity)
                                .createQueryBuilder(Entities_1.Entities.INVOICE)
                                .update(InvoiceEntities_1.InvoiceEntity)
                                .set({
                                invoice_date: payload.invoice_date,
                                shipping_details: payload.shipping_details,
                                carrier: payload.carrier,
                                discount: payload.discount,
                                est_weight: payload.est_weight,
                                delivery_fee: payload.delivery_fee,
                                down_payment: payload.down_payment,
                                total_order: payload.total_order,
                                special_note: payload.special_note,
                                transportation: payload.transportation,
                                approval_ind: 'N'
                            })
                                .where('reference_value = :reference_value', { reference_value: payload.reference_value })
                                .execute();
                            yield transactionEntityManager
                                .getRepository(OrderEntities_1.OrderEntity)
                                .createQueryBuilder(Entities_1.Entities.ORDER)
                                .update(OrderEntities_1.OrderEntity)
                                .set({
                                order_status: 'For Payment'
                            })
                                .where('id = :id', { id: payload.invoice_order_id })
                                .execute();
                            yield transactionEntityManager
                                .getRepository(CustomerEntities_1.CustomerEntity)
                                .createQueryBuilder(Entities_1.Entities.CUSTOMER)
                                .update(CustomerEntities_1.CustomerEntity)
                                .set({
                                customer_balance: payload.total_order,
                                customer_status: 'Pending Payment'
                            })
                                .where('id = :id', { id: CustomerID.customer_id })
                                .execute();
                        }
                        else if (payload.event_request === 'Delete') {
                            yield transactionEntityManager
                                .getRepository(OrderEntities_1.OrderEntity)
                                .createQueryBuilder(Entities_1.Entities.ORDER)
                                .update(OrderEntities_1.OrderEntity)
                                .set({
                                order_status: 'For Invoice'
                            })
                                .where('id = :id', { id: payload.invoice_order_id })
                                .execute();
                            yield transactionEntityManager
                                .getRepository(CustomerEntities_1.CustomerEntity)
                                .createQueryBuilder(Entities_1.Entities.CUSTOMER)
                                .update(CustomerEntities_1.CustomerEntity)
                                .set({
                                customer_balance: CustomerID.amount_to_pay,
                                customer_status: 'Pending Invoice'
                            })
                                .where('id = :id', { id: CustomerID.customer_id })
                                .execute();
                            yield transactionEntityManager.getRepository(InvoiceEntities_1.InvoiceEntity).createQueryBuilder(Entities_1.Entities.INVOICE).delete().where({ reference_value: payload.reference_value }).execute();
                        }
                    }
                    yield transactionEntityManager.getRepository(InvoicePendingEntities_1.InvoicePendingEntity).delete({ id });
                    return true;
                }
                catch (err) {
                    console.log('Error in ${payload.status} Invoice Pending Dao Transaction -> ', err);
                    return false;
                }
            }));
            if (transaction) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Approval]), { message: `Successfully ${payload.status}.` });
            }
            else {
                console.log('Error Dao: Rejecting Invoice Pending Transaction -> ', `Error in ${payload.status} Invoice Pending!`);
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `Error in ${payload.status} Invoice Pending!` });
            }
        }
        catch (err) {
            console.log('Error Dao: delete Invoice -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const restoreInvoice = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield typeorm_1.getRepository(InvoiceEntities_1.InvoiceEntity)
                .createQueryBuilder(Entities_1.Entities.INVOICE)
                .update(InvoiceEntities_1.InvoiceEntity)
                .set(Object.assign(Object.assign({}, payload), { updated_at: new Date() }))
                .where('id = :id', { id })
                .execute();
            yield typeorm_1.getRepository(InvoiceEntities_1.InvoiceEntity).restore({ id });
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Restored]), { message: 'Successfully restored.' });
        }
        catch (err) {
            console.log('Error Dao: restoreInvoice -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    return {
        getAllInvoice,
        getInvoice,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoicePending,
        createInvoicePending,
        updateInvoicePending,
        deleteInvoicePending,
        approvalInvoicePending,
        restoreInvoice
    };
};
//# sourceMappingURL=InvoiceDao.js.map
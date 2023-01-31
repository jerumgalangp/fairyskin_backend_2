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
exports.useProductDao = void 0;
const typeorm_1 = require("typeorm");
const HttpConstant_1 = require("../constant/HttpConstant");
const ProductEntities_1 = require("../entities/ProductEntities");
const Entities_1 = require("./../constant/Entities");
const ProductPendingEntities_1 = require("./../entities/ProductPendingEntities");
const Schema_1 = require("./../util/Schema");
exports.useProductDao = () => {
    const getAllProduct = (_payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            if (!defaultSort.includes('.')) {
                defaultSort = Entities_1.Entities.PRODUCTS + '.' + defaultSort;
            }
            let query = typeorm_1.getRepository(ProductEntities_1.ProductsEntity).createQueryBuilder(Entities_1.Entities.PRODUCTS);
            if (headers.filters !== undefined && ((_a = headers.filters) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                let filters = JSON.parse(headers.filters);
                filters.map((v) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like :q`, { q: `%${v.value.toUpperCase()}%` });
                    }
                    else {
                        query = query.andWhere(`UPPER(${Entities_1.Entities.PRODUCTS}.${v.id}) Like :q`, { q: `%${v.value.toUpperCase()}%` });
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
            console.log('Error Dao: Query for getProductDao Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const getProduct = (_payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            if (!defaultSort.includes('.')) {
                if (defaultSort === 'delivered_quantity') {
                    defaultSort = 'total_delivered' + '.' + defaultSort;
                }
                else if (defaultSort === 'remaining_quantity') {
                    defaultSort = defaultSort;
                }
                else {
                    defaultSort = Entities_1.Entities.PRODUCTS + '.' + defaultSort;
                }
            }
            const totalQuantity = typeorm_1.getManager()
                .createQueryBuilder()
                .select('"productId"', 'productId')
                .addSelect('SUM(quantity)', 'ordered_quantity')
                .from(Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER_PRODUCTS), Entities_1.Entities.ORDER_PRODUCTS)
                .groupBy('"productId"');
            const totalDelivered = typeorm_1.getManager()
                .createQueryBuilder()
                .select('"productId"', 'productId')
                .addSelect('SUM(delivered_quantity)', 'delivered_quantity')
                .from(Schema_1.useSchemaAndTableName(Entities_1.Entities.ORDER_DELIVERED), Entities_1.Entities.ORDER_DELIVERED)
                .groupBy('"productId"');
            let query = typeorm_1.getManager()
                .createQueryBuilder()
                .select(`${Entities_1.Entities.PRODUCTS}.id`, 'id')
                .addSelect('product_code', 'product_code')
                .addSelect('product_name', 'product_name')
                .addSelect('quantity', 'quantity')
                .addSelect('total_orders.ordered_quantity', 'ordered_quantity')
                .addSelect('total_delivered.delivered_quantity', 'delivered_quantity')
                .addSelect('coalesce(total_orders.ordered_quantity,0) - coalesce(total_delivered.delivered_quantity,0)', 'remaining_quantity')
                .addSelect('(quantity - coalesce(total_orders.ordered_quantity,0)) + coalesce(total_delivered.delivered_quantity,0)', 'forecasted_quantity')
                .addSelect('reference_value', 'reference_value')
                .addSelect('approval_ind', 'approval_ind')
                .from(Schema_1.useSchemaAndTableName(Entities_1.Entities.PRODUCTS), Entities_1.Entities.PRODUCTS)
                .leftJoin('(' + totalQuantity.getQuery() + ')', 'total_orders', `total_orders."productId" = ${Entities_1.Entities.PRODUCTS}.id`)
                .leftJoin('(' + totalDelivered.getQuery() + ')', 'total_delivered', `total_delivered."productId" = ${Entities_1.Entities.PRODUCTS}.id`);
            if (headers.filters !== undefined && ((_b = headers.filters) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                let filters = JSON.parse(headers.filters);
                filters.map((v) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like '%${v.value.toUpperCase()}%' `);
                    }
                    else {
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
            console.log('Error Dao: Query for getProductDao Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const createProduct = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let Product_id;
            const userExist = yield typeorm_1.getRepository(ProductEntities_1.ProductsEntity).createQueryBuilder(Entities_1.Entities.PRODUCTS).where(`UPPER(Product_name) = UPPER('${payload.product_name}')`).getMany();
            if (userExist.length > 0) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `User ${payload.product_name.toUpperCase()} already exist!` });
            }
            const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const data = yield transactionEntityManager
                        .getRepository(ProductEntities_1.ProductsEntity)
                        .createQueryBuilder(Entities_1.Entities.PRODUCTS)
                        .insert()
                        .into(ProductEntities_1.ProductsEntity)
                        .values(payload)
                        .execute();
                    let { id } = data.identifiers[0];
                    Product_id = id;
                    return true;
                }
                catch (err) {
                    console.log('Error Dao: Deleting ewt Dao Transaction -> ', err);
                    return false;
                }
            }));
            if (transaction) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Created]), { Product_id, message: 'Successfully created.' });
            }
            else {
                console.log('Error Dao: Create Product Transaction -> ', 'Error Creating Product!');
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: 'Error Creating Product!' });
            }
        }
        catch (err) {
            console.log('Error Dao: Create Product Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const updateProduct = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = typeorm_1.getRepository(ProductEntities_1.ProductsEntity).createQueryBuilder(Entities_1.Entities.PRODUCTS).update(ProductEntities_1.ProductsEntity).set(payload).where('id = :id', { id });
            yield query.execute();
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Updated]), { message: 'Successfully updated.' });
        }
        catch (err) {
            console.log('Error Dao: update Product -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const deleteProduct = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield typeorm_1.getRepository(ProductEntities_1.ProductsEntity).createQueryBuilder(Entities_1.Entities.PRODUCTS).update(ProductEntities_1.ProductsEntity).set(payload).where('id = :id', { id }).execute();
            yield typeorm_1.getRepository(ProductEntities_1.ProductsEntity).delete({ id });
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Deleted]), { message: 'Successfully deleted.' });
        }
        catch (err) {
            console.log('Error Dao: delete Product -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const getProductPending = (_payload, pagination, headers) => __awaiter(void 0, void 0, void 0, function* () {
        var _c;
        try {
            let defaultSort = 'request_date';
            if (headers.sort_by !== undefined)
                defaultSort = headers.sort_by;
            if (!defaultSort.includes('.')) {
                defaultSort = Entities_1.Entities.PRODUCTS_PENDING + '.' + defaultSort;
            }
            let query = typeorm_1.getManager()
                .createQueryBuilder()
                .select(`${Entities_1.Entities.PRODUCTS_PENDING}.id`, 'id')
                .addSelect(`${Entities_1.Entities.PRODUCTS_PENDING}.product_code`, 'product_code')
                .addSelect(`${Entities_1.Entities.PRODUCTS_PENDING}.product_name`, 'product_name')
                .addSelect(`${Entities_1.Entities.PRODUCTS}.product_name`, 'original_product_name')
                .addSelect(`${Entities_1.Entities.PRODUCTS_PENDING}.quantity`, 'quantity')
                .addSelect(`${Entities_1.Entities.PRODUCTS}.quantity`, 'original_quantity')
                .addSelect(`${Entities_1.Entities.PRODUCTS_PENDING}.reference_value`, 'reference_value')
                .addSelect(`${Entities_1.Entities.PRODUCTS_PENDING}.forecasted_quantity`, 'forecasted_quantity')
                .addSelect('event_request', 'event_request')
                .addSelect('request_date', 'request_date')
                .addSelect('request_by', 'request_by')
                .from(Schema_1.useSchemaAndTableName(Entities_1.Entities.PRODUCTS_PENDING), Entities_1.Entities.PRODUCTS_PENDING)
                .leftJoin(ProductEntities_1.ProductsEntity, `${Entities_1.Entities.PRODUCTS}`, `${Entities_1.Entities.PRODUCTS}.reference_value = ${Entities_1.Entities.PRODUCTS_PENDING}.reference_value`);
            if (headers.filters !== undefined && ((_c = headers.filters) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                let filters = JSON.parse(headers.filters);
                filters.map((v) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like '%${v.value.toUpperCase()}%' `);
                    }
                    else {
                        query = query.andWhere(`UPPER(${Entities_1.Entities.PRODUCTS_PENDING}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
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
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success]), { message: 'Successfully Retrieved data.', results, pagination: { total, current: pagination.current, pageCount } });
        }
        catch (err) {
            console.log('Error Dao: Query for getProductDao Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const createProductPending = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const productPendingExist = yield typeorm_1.getRepository(ProductPendingEntities_1.ProductsPendingEntity)
                .createQueryBuilder(Entities_1.Entities.PRODUCTS_PENDING)
                .where(`UPPER(product_code) = UPPER('${payload.product_code.trim()}')`)
                .getMany();
            const productExist = yield typeorm_1.getRepository(ProductEntities_1.ProductsEntity).createQueryBuilder(Entities_1.Entities.PRODUCTS).where(`UPPER(product_code) = UPPER('${payload.product_code.trim()}')`).getMany();
            if (productExist.length > 0 || productPendingExist.length > 0) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `Product ${payload.product_code.toUpperCase()} is already pending for approval!` });
            }
            const data = yield typeorm_1.getRepository(ProductPendingEntities_1.ProductsPendingEntity).createQueryBuilder(Entities_1.Entities.PRODUCTS_PENDING).insert().into(ProductPendingEntities_1.ProductsPendingEntity).values(payload).execute();
            let { id } = data.identifiers[0];
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Created]), { id, message: 'Successfully submitted for approval.' });
        }
        catch (err) {
            console.log('Error Dao: Create Product Transaction -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const updateProductPending = (_id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const productPendingExist = yield typeorm_1.getRepository(ProductPendingEntities_1.ProductsPendingEntity)
                .createQueryBuilder(Entities_1.Entities.PRODUCTS_PENDING)
                .where(`UPPER(product_code) = UPPER('${payload.product_code}')`)
                .getMany();
            if (productPendingExist.length > 0) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `Product ${payload.product_name.toUpperCase()} is already pending for approval!` });
            }
            const productExist = yield typeorm_1.getRepository(ProductEntities_1.ProductsEntity).createQueryBuilder(Entities_1.Entities.PRODUCTS).where(`UPPER(product_code) = UPPER('${payload.product_code}')`).getMany();
            if (productExist.length > 0) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `Product ${payload.product_code.toUpperCase()} is already exist!` });
            }
            const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield transactionEntityManager
                        .getRepository(ProductEntities_1.ProductsEntity)
                        .createQueryBuilder(Entities_1.Entities.PRODUCTS)
                        .update(ProductEntities_1.ProductsEntity)
                        .set({ approval_ind: 'Y' })
                        .where('reference_value = :reference_value', { reference_value: payload.reference_value })
                        .execute();
                    yield transactionEntityManager.getRepository(ProductPendingEntities_1.ProductsPendingEntity).createQueryBuilder(Entities_1.Entities.PRODUCTS_PENDING).insert().into(ProductPendingEntities_1.ProductsPendingEntity).values(payload).execute();
                    return true;
                }
                catch (err) {
                    console.log('Error in ${payload.status} Product Pending Dao Transaction -> ', err);
                    return false;
                }
            }));
            if (transaction) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Updated]), { message: 'Successfully submitted for approval.' });
            }
            else {
                console.log('Error Dao: Rejecting Product Pending Transaction -> ', `Error in Product Pending!`);
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `Error in Product Pending!` });
            }
        }
        catch (err) {
            console.log('Error Dao: Update Product Pending -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const deleteProductPending = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const productPendingExist = yield typeorm_1.getRepository(ProductPendingEntities_1.ProductsPendingEntity).createQueryBuilder(Entities_1.Entities.PRODUCTS_PENDING).where(`UPPER(reference_value) = UPPER('${id}')`).getMany();
            if (productPendingExist.length > 0) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `Product ${productPendingExist[0].product_code.toUpperCase()} is already pending for approval!` });
            }
            const productMain = yield typeorm_1.getRepository(ProductEntities_1.ProductsEntity).createQueryBuilder(Entities_1.Entities.PRODUCTS).where(`UPPER(reference_value) = UPPER('${id}')`).getOne();
            const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield transactionEntityManager
                        .getRepository(ProductEntities_1.ProductsEntity)
                        .createQueryBuilder(Entities_1.Entities.PRODUCTS)
                        .update(ProductEntities_1.ProductsEntity)
                        .set({ approval_ind: 'Y' })
                        .where('reference_value = :reference_value', { reference_value: id })
                        .execute();
                    yield transactionEntityManager
                        .getRepository(ProductPendingEntities_1.ProductsPendingEntity)
                        .createQueryBuilder(Entities_1.Entities.PRODUCTS_PENDING)
                        .insert()
                        .into(ProductPendingEntities_1.ProductsPendingEntity)
                        .values({
                        product_code: productMain === null || productMain === void 0 ? void 0 : productMain.product_code,
                        product_name: productMain === null || productMain === void 0 ? void 0 : productMain.product_name,
                        quantity: productMain === null || productMain === void 0 ? void 0 : productMain.quantity,
                        reference_value: productMain === null || productMain === void 0 ? void 0 : productMain.reference_value,
                        request_by: payload.request_by,
                        event_request: payload.event_request,
                        request_date: payload.request_date
                    })
                        .execute();
                    return true;
                }
                catch (err) {
                    console.log('Error Product Pending Dao Transaction -> ', err);
                    return false;
                }
            }));
            if (transaction) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Deleted]), { message: 'Successfully submitted for approval.' });
            }
            else {
                console.log('Error Dao: Rejecting Product Pending Transaction -> ', `Error in Product Pending!`);
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `Error in Product Pending!` });
            }
        }
        catch (err) {
            console.log('Error Dao: delete Product -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const approvalProductPending = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transaction = yield typeorm_1.getManager().transaction((transactionEntityManager) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    if (payload.status === 'Rejected') {
                        if (payload.event_request === 'Modify' || payload.event_request === 'Delete') {
                            yield transactionEntityManager
                                .getRepository(ProductEntities_1.ProductsEntity)
                                .createQueryBuilder(Entities_1.Entities.PRODUCTS)
                                .update(ProductEntities_1.ProductsEntity)
                                .set({ approval_ind: 'N' })
                                .where('reference_value = :reference_value', { reference_value: payload.reference_value })
                                .execute();
                        }
                    }
                    else {
                        if (payload.event_request === 'Add') {
                            const productPending = yield transactionEntityManager
                                .getRepository(ProductPendingEntities_1.ProductsPendingEntity)
                                .createQueryBuilder(Entities_1.Entities.PRODUCTS_PENDING)
                                .where('id = :id', { id })
                                .getOne();
                            let data = {
                                product_code: productPending.product_code,
                                product_name: productPending.product_name,
                                quantity: productPending.quantity,
                                ordered_quantity: 0,
                                forecasted_quantity: productPending.quantity,
                                approval_ind: 'N',
                                created_by: productPending.request_by,
                                reference_value: productPending.reference_value
                            };
                            yield transactionEntityManager.getRepository(ProductEntities_1.ProductsEntity).createQueryBuilder(Entities_1.Entities.PRODUCTS).insert().into(ProductEntities_1.ProductsEntity).values(data).execute();
                        }
                        else if (payload.event_request === 'Modify') {
                            yield transactionEntityManager
                                .getRepository(ProductEntities_1.ProductsEntity)
                                .createQueryBuilder(Entities_1.Entities.PRODUCTS)
                                .update(ProductEntities_1.ProductsEntity)
                                .set({
                                product_code: payload.product_code,
                                product_name: payload.product_name,
                                quantity: payload.quantity,
                                approval_ind: 'N',
                                forecasted_quantity: payload.forecasted_quantity
                            })
                                .where('reference_value = :reference_value', { reference_value: payload.reference_value })
                                .execute();
                        }
                        else if (payload.event_request === 'Delete') {
                            yield transactionEntityManager.getRepository(ProductEntities_1.ProductsEntity).createQueryBuilder(Entities_1.Entities.PRODUCTS).delete().where({ reference_value: payload.reference_value }).execute();
                        }
                    }
                    yield transactionEntityManager.getRepository(ProductPendingEntities_1.ProductsPendingEntity).delete({ id });
                    return true;
                }
                catch (err) {
                    console.log('Error in ${payload.status} Product Pending Dao Transaction -> ', err);
                    return false;
                }
            }));
            if (transaction) {
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Approval]), { message: `Successfully ${payload.status}.` });
            }
            else {
                console.log('Error Dao: Rejecting Product Pending Transaction -> ', `Error in ${payload.status} Product Pending!`);
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: `Error in ${payload.status} Product Pending!` });
            }
        }
        catch (err) {
            console.log('Error Dao: delete Product -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    const restoreProduct = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield typeorm_1.getRepository(ProductEntities_1.ProductsEntity)
                .createQueryBuilder(Entities_1.Entities.PRODUCTS)
                .update(ProductEntities_1.ProductsEntity)
                .set(Object.assign(Object.assign({}, payload), { updated_at: new Date() }))
                .where('id = :id', { id })
                .execute();
            yield typeorm_1.getRepository(ProductEntities_1.ProductsEntity).restore({ id });
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Restored]), { message: 'Successfully restored.' });
        }
        catch (err) {
            console.log('Error Dao: restoreProduct -> ', err);
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: err.message });
        }
    });
    return {
        getAllProduct,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        getProductPending,
        createProductPending,
        updateProductPending,
        deleteProductPending,
        approvalProductPending,
        restoreProduct
    };
};
//# sourceMappingURL=ProductDao.js.map
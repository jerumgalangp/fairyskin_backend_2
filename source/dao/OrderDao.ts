import moment from 'moment';
import { OrderDeliveredEntity } from './../entities/OrderDeliveredEntities';
import { OrderDeliveredPendingEntity } from './../entities/OrderDeliveredPendingEntities';
import { OrderPendigEntity } from './../entities/OrderPendingEntities';
import { ProductsEntity } from './../entities/ProductEntities';

import { OrderDaoCreateInterface, OrderDaoDeleteInterface, OrderDaoRestoreInterface, OrderDaoUpdateInterface } from 'source/interfaces/dao/OrderDaoInterface';
import { CustomerEntity } from './../entities/CustomerEntities';
import { RoleEntity } from './../entities/RoleEntities';
import { UserEntity } from './../entities/UserEntities';
import { OrderDeliveryPendingDaoApprovalInterface, OrderDeliveryPendingDaoUpdateInterface } from './../interfaces/dao/OrderDeliveryPendingDaoInterface';
import { useSchemaAndTableName } from './../util/Schema';

import { Between, FindManyOptions, getManager, getRepository, InsertResult } from 'typeorm';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { PaginationDaoInterface } from '../interfaces/dao/PaginationDaoInterface';
import { Entities } from './../constant/Entities';
import { OrderEntity } from './../entities/OrderEntities';
import { OrderProductEntity } from './../entities/OrderProductEntities';
import { HeadersRouteInterface } from './../interfaces/routes/HttpRoutesInterface';
import { OrderRouteInterface } from './../interfaces/routes/OrderRouteInterface';

export const useOrderDao = () => {
    const getOrder = async (payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = Entities.ORDER + '.' + 'created_at';
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

            // if (!defaultSort.includes('.')) {
            //     defaultSort = Entities.ORDER + '.' + defaultSort;
            // } else {
            //     if (defaultSort === 'order_customer.user.name') {
            //         defaultSort = Entities.USER + '.name';
            //     }
            // }

            // let query = getRepository(OrderEntity)
            //     .createQueryBuilder(Entities.ORDER)
            //     // first argument = san entity kukunin para ilagay OrderEntity.order_customer,
            //     // second argument = san ijoin na table
            //     // third argument = alias ng join table
            //     // fourth argument = san mag On
            //     .leftJoinAndMapOne(`${Entities.ORDER}.order_customer`, CustomerEntity, `${Entities.CUSTOMER}`, `${Entities.CUSTOMER}.id = ${Entities.ORDER}.customer_id`)
            //     .leftJoinAndMapOne(`${Entities.CUSTOMER}.user`, UserEntity, `${Entities.USER}`, `${Entities.USER}.id = ${Entities.CUSTOMER}.user_id`)
            //     .leftJoinAndMapOne(`${Entities.USER}.role`, RoleEntity, `${Entities.ROLES}`, `${Entities.ROLES}.id = ${Entities.USER}.role_id`)
            //     .leftJoinAndMapMany(`${Entities.ORDER}.order_products`, OrderProductEntity, `${Entities.ORDER_PRODUCTS}`, `${Entities.ORDER_PRODUCTS}.orderId = ${Entities.ORDER}.id`)
            //     .leftJoinAndMapOne(`${Entities.ORDER_PRODUCTS}.product`, ProductsEntity, `${Entities.PRODUCTS}`, `${Entities.PRODUCTS}.id = ${Entities.ORDER_PRODUCTS}.productId`);

            const o = useSchemaAndTableName(Entities.ORDER);
            const op = useSchemaAndTableName(Entities.ORDER_PRODUCTS);

            const totalOrders: any = getManager().createQueryBuilder().select('"orderId"', 'orderId').addSelect('SUM(quantity)', 'quantity').from(op, Entities.ORDER_PRODUCTS).groupBy('"orderId"');

            let query: any = getManager()
                .createQueryBuilder()
                .select(`${Entities.ORDER}.id`, 'id')
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
                .addSelect(`${Entities.USER}.name`, 'name')
                .addSelect(`${Entities.USER}.contact_number`, 'contact_number')
                .addSelect(`${Entities.USER}.address`, 'address')
                .addSelect(`${Entities.ROLES}.role_description`, 'role')
                .addSelect(`${Entities.CUSTOMER}.customer_over_payment`, 'over_payment')
                .from(o, Entities.ORDER)
                .leftJoin('(' + totalOrders.getQuery() + ')', 'total_orders', `total_orders."orderId" = ${Entities.ORDER}.id`)
                .leftJoin(CustomerEntity, `${Entities.CUSTOMER}`, `${Entities.CUSTOMER}.id = ${Entities.ORDER}.customer_id`)
                .leftJoin(UserEntity, `${Entities.USER}`, `${Entities.USER}.id = ${Entities.CUSTOMER}.user_id`)
                .leftJoin(RoleEntity, `${Entities.ROLES}`, `${Entities.ROLES}.id = ${Entities.USER}.role_id`)
                .where(where);

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);

                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        let filter0 = f[0];
                        let filter1 = f[1];
                        query = query.andWhere(`UPPER(${filter0}.${filter1}) Like '%${v.value.toUpperCase()}%' `);
                    } else {
                        let w = `${Entities.ORDER}.${v.id}`;
                        if (v.id === 'name') {
                            w = `${Entities.USER}.${v.id}`;
                        }

                        query = query.andWhere(`UPPER(${w}) Like '%${v.value.toUpperCase()}%' `);
                    }
                });
            }

            const count = await query.getCount();

            query
                .offset(pagination.skip)
                .limit(pagination.take)
                .orderBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC');

            //raw mayn offset limit
            const results = await query.getRawMany();

            // console.log('-----------results------------');
            // console.log(query);
            // console.log('----------results-------------');

            // console.log('-----------results------------');
            // console.log(results);
            // console.log('----------results-------------');
            const total = count;
            let pageCount = Math.ceil(total / pagination.take) || 1;

            return {
                ...HTTP_RESPONSES[HttpResponseType.Success],
                message: 'Successfully Retrieved data.',
                results,
                pagination: { total, current: pagination.current, pageCount }
            };
        } catch (err) {
            console.log('Error Dao: Query for getOrderDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const getOrderDelivery = async (payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = Entities.ORDER + '.' + 'created_at';
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
                        where = `order_status in (${whereIn}) and DATE(${Entities.ORDER}.CREATED_AT) BETWEEN DATE('${date_from.df._value}') AND DATE('${date_to.dt._value}')`;
                    }
                } else where = `Upper(order_status) = Upper('${payload[0].order_status}')`;
            }

            const o = useSchemaAndTableName(Entities.ORDER);
            const op = useSchemaAndTableName(Entities.ORDER_PRODUCTS);
            const od = useSchemaAndTableName(Entities.ORDER_DELIVERED);

            const totalOrders: any = getManager().createQueryBuilder().select('"orderId"', 'orderId').addSelect('SUM(quantity)', 'quantity').from(op, Entities.ORDER_PRODUCTS).groupBy('"orderId"');

            const totalOrdersDelivered: any = getManager()
                .createQueryBuilder()
                .select('"orderId"', 'orderId')
                .addSelect('delivered_date', 'delivered_date')
                .addSelect('SUM(remaining_quantity)', 'remaining_quantity')
                .addSelect('SUM(delivered_quantity)', 'delivered_quantity')
                .addSelect('SUM(original_quantity)', 'original_quantity')
                .from(od, Entities.ORDER_DELIVERED)
                .groupBy('"orderId"')
                .addGroupBy('delivered_date');

            let query: any = getManager()
                .createQueryBuilder()
                .select(`${Entities.ORDER}.id`, 'id')
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
                .addSelect(`${Entities.USER}.name`, 'name')
                .addSelect(`${Entities.USER}.contact_number`, 'contact_number')
                .addSelect(`${Entities.USER}.address`, 'address')
                .addSelect(`${Entities.ROLES}.role_description`, 'role')
                .addSelect(`${Entities.CUSTOMER}.customer_over_payment`, 'over_payment')
                .from(o, Entities.ORDER)
                .leftJoin('(' + totalOrders.getQuery() + ')', 'total_orders', `total_orders."orderId" = ${Entities.ORDER}.id`)
                .leftJoin('(' + totalOrdersDelivered.getQuery() + ')', 'total_orders_delivered', `total_orders_delivered."orderId" = ${Entities.ORDER}.id`)
                .leftJoin(CustomerEntity, `${Entities.CUSTOMER}`, `${Entities.CUSTOMER}.id = ${Entities.ORDER}.customer_id`)
                .leftJoin(UserEntity, `${Entities.USER}`, `${Entities.USER}.id = ${Entities.CUSTOMER}.user_id`)
                .leftJoin(RoleEntity, `${Entities.ROLES}`, `${Entities.ROLES}.id = ${Entities.USER}.role_id`)
                .where(where);

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);

                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        let filter0 = f[0];
                        let filter1 = f[1];
                        query = query.andWhere(`UPPER(${filter0}.${filter1}) Like '%${v.value.toUpperCase()}%' `);
                    } else {
                        let w = `${Entities.ORDER}.${v.id}`;
                        if (v.id === 'name') {
                            w = `${Entities.USER}.${v.id}`;
                        }

                        query = query.andWhere(`UPPER(${w}) Like '%${v.value.toUpperCase()}%' `);
                    }
                });
            }

            const count = await query.getCount();
            // console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
            // console.log(count);
            // console.log('-----------------------------');

            query
                .offset(pagination.skip)
                .limit(pagination.take)
                .orderBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC');

            //raw mayn offset limit
            const results = await query.getRawMany();

            // console.log('-----------results------------');
            // console.log(query);
            // console.log('----------results-------------');

            // console.log('-----------results------------');
            // console.log(results);
            // console.log('----------results-------------');
            const total = count;
            let pageCount = Math.ceil(total / pagination.take) || 1;

            return {
                ...HTTP_RESPONSES[HttpResponseType.Success],
                message: 'Successfully Retrieved data.',
                results,
                pagination: { total, current: pagination.current, pageCount }
            };
        } catch (err) {
            console.log('Error Dao: Query for getOrderDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const getOrderDeliveryPending = async (payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = Entities.ORDER_PENDING + '.' + 'request_date';
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

            const o = useSchemaAndTableName(Entities.ORDER_PENDING);
            const op = useSchemaAndTableName(Entities.ORDER_DELIVERED_PENDING);

            const totalOrders: any = getManager()
                .createQueryBuilder()
                .select('"orderId"', 'order_id')
                .addSelect('max(reference_value)', 'reference_value')
                .addSelect('SUM(delivered_quantity)', 'quantity')
                .from(op, Entities.ORDER_DELIVERED_PENDING)
                .leftJoin(OrderEntity, `${Entities.ORDER}`, `${Entities.ORDER}.id = ${Entities.ORDER_DELIVERED_PENDING}.orderId`)
                .groupBy('"orderId"');

            //let resultTotalOrders = await totalOrders.execute();
            // console.log('------------------------------------');
            // console.log(resultTotalOrders.length);
            // console.log('------------------------------------');

            let query: any = getManager()
                .createQueryBuilder()
                .select(`${Entities.ORDER_PENDING}.id`, 'id')
                .addSelect(
                    `CASE WHEN coalesce(total_orders.quantity,0) = 0 
                            THEN
                                ${Entities.ORDER}.id
                            ELSE
                                total_orders.order_id
                            END`,
                    'order_id'
                )
                .addSelect(`${Entities.ORDER_PENDING}.si_number`, 'si_number')
                .addSelect('coalesce(total_orders.quantity,0) ', 'quantity')
                .addSelect(`${Entities.ORDER_PENDING}.amount_to_pay`, 'amount_to_pay')
                .addSelect(`${Entities.ORDER_PENDING}.amount_to_pay`, 'total')
                .addSelect(`${Entities.ORDER_PENDING}.order_status`, 'order_status')
                .addSelect(`${Entities.ORDER_PENDING}.payment_remarks`, 'payment_remarks')
                .addSelect(`${Entities.ORDER_PENDING}.payment_status`, 'payment_status')
                .addSelect(`${Entities.ORDER_PENDING}.order_date`, 'order_date')
                .addSelect(`${Entities.ORDER_PENDING}.delivered_date`, 'delivered_date')
                .addSelect(`${Entities.ORDER_PENDING}.order_remarks`, 'order_remarks')
                .addSelect(`${Entities.ORDER_PENDING}.customer_id`, 'customer_id')
                .addSelect(`${Entities.ORDER_PENDING}.reference_value`, 'reference_value')
                .addSelect(`${Entities.ORDER_PENDING}.approval_ind`, 'approval_ind')
                .addSelect(`${Entities.USER}.name`, 'name')
                .addSelect(`${Entities.USER}.contact_number`, 'contact_number')
                .addSelect(`${Entities.USER}.address`, 'address')
                .addSelect(`${Entities.ROLES}.role_description`, 'role')
                .addSelect(`${Entities.CUSTOMER}.customer_over_payment`, 'over_payment')
                .from(o, Entities.ORDER_PENDING)
                .leftJoin('(' + totalOrders.getQuery() + ')', 'total_orders', `total_orders.reference_value = ${Entities.ORDER_PENDING}.reference_value`)
                .leftJoin(CustomerEntity, `${Entities.CUSTOMER}`, `${Entities.CUSTOMER}.id = ${Entities.ORDER_PENDING}.customer_id`)
                .leftJoin(OrderEntity, `${Entities.ORDER}`, `${Entities.ORDER}.reference_value = ${Entities.ORDER_PENDING}.reference_value`)
                .leftJoin(UserEntity, `${Entities.USER}`, `${Entities.USER}.id = ${Entities.CUSTOMER}.user_id`)
                .leftJoin(RoleEntity, `${Entities.ROLES}`, `${Entities.ROLES}.id = ${Entities.USER}.role_id`)
                .where(where);

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);

                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        let filter0 = f[0];
                        let filter1 = f[1];
                        query = query.andWhere(`UPPER(${filter0}.${filter1}) Like '%${v.value.toUpperCase()}%' `);
                    } else {
                        let w = `${Entities.ORDER}.${v.id}`;
                        if (v.id === 'name') {
                            w = `${Entities.USER}.${v.id}`;
                        }

                        query = query.andWhere(`UPPER(${w}) Like '%${v.value.toUpperCase()}%' `);
                    }
                });
            }

            const count = await query.getCount();

            query
                .offset(pagination.skip)
                .limit(pagination.take)
                .orderBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC');

            //raw mayn offset limit
            const results = await query.getRawMany();

            // console.log('-----------results------------');
            // console.log(query);
            // console.log('----------results-------------');

            // console.log('-----------results------------');
            // console.log(results);
            // console.log('----------results-------------');
            const total = count;
            let pageCount = Math.ceil(total / pagination.take) || 1;

            return {
                ...HTTP_RESPONSES[HttpResponseType.Success],
                message: 'Successfully Retrieved data.',
                results,
                pagination: { total, current: pagination.current, pageCount }
            };
        } catch (err) {
            console.log('Error Dao: Query for getOrderDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const getOrderProduct = async (payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = Entities.ORDER_PRODUCTS + '.' + 'id';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            let query = getRepository(OrderProductEntity)
                .createQueryBuilder(Entities.ORDER_PRODUCTS)
                .leftJoinAndSelect(`${Entities.ORDER_PRODUCTS}.product`, 'product', `product.id = ${Entities.ORDER_PRODUCTS}.productId`)
                .where('"orderId" = :orderId', { orderId: payload[0].id });

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);

                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        let filter0 = f[0];
                        let filter1 = f[1];
                        query = query.andWhere(`UPPER(${filter0}.${filter1}) Like '%${v.value.toUpperCase()}%' `);
                    } else {
                        query = query.andWhere(`UPPER(${Entities.ORDER}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
                    }
                });
            }

            const count = await query.getCount();

            query
                .skip(pagination.skip)
                .take(pagination.take)
                .orderBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC');

            const results = await query.getMany();

            // console.log('-----------results------------');
            // console.log(results);
            // console.log('----------results-------------');

            const total = count;
            let pageCount = Math.ceil(total / pagination.take) || 1;

            return {
                ...HTTP_RESPONSES[HttpResponseType.Success],
                message: 'Successfully Retrieved data.',
                results,
                pagination: { total, current: pagination.current, pageCount }
            };
        } catch (err) {
            console.log('Error Dao: Query for getOrderProduct Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const getOrderDeliveredProduct = async (payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = Entities.ORDER_DELIVERED + '.' + 'id';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            const o = useSchemaAndTableName(Entities.ORDER_DELIVERED);

            let query: any = getManager()
                .createQueryBuilder()
                .select(`${Entities.ORDER_DELIVERED}.id`, 'id')
                .addSelect('original_quantity', 'original_quantity')
                .addSelect('delivered_quantity', 'delivered_quantity')
                .addSelect('remaining_quantity', 'remaining_quantity')
                .addSelect('distributed_quantity', 'distributed_quantity')
                .addSelect('"orderId"', 'order_id')
                .addSelect('"productId"', 'product_id')
                .addSelect(`${Entities.PRODUCTS}.product_code`, 'product_code')
                .addSelect(`${Entities.PRODUCTS}.product_name`, 'product_name')
                .from(o, Entities.ORDER_DELIVERED)
                .leftJoin(OrderEntity, `${Entities.ORDER}`, `${Entities.ORDER}.id = ${Entities.ORDER_DELIVERED}.orderId`)
                .leftJoin(ProductsEntity, `${Entities.PRODUCTS}`, `${Entities.PRODUCTS}.id = ${Entities.ORDER_DELIVERED}.productId`)
                .where('"orderId" = :orderId', { orderId: payload[0].id });

            // let query = getRepository(OrderDeliveredEntity)
            //     .createQueryBuilder(Entities.ORDER_DELIVERED)
            //     .leftJoinAndSelect(`${Entities.ORDER_DELIVERED}.product`, 'product', `product.id = ${Entities.ORDER_DELIVERED}.productId`)

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);

                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        let filter0 = f[0];
                        let filter1 = f[1];
                        query = query.andWhere(`UPPER(${filter0}.${filter1}) Like '%${v.value.toUpperCase()}%' `);
                    } else {
                        query = query.andWhere(`UPPER(${Entities.ORDER_DELIVERED}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
                    }
                });
            }

            const count = await query.getCount();

            query
                .offset(pagination.skip)
                .limit(pagination.take)
                .orderBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC');

            const results = await query.getRawMany();

            const total = count;
            let pageCount = Math.ceil(total / pagination.take) || 1;

            return {
                ...HTTP_RESPONSES[HttpResponseType.Success],
                message: 'Successfully Retrieved data.',
                results,
                pagination: { total, current: pagination.current, pageCount }
            };
        } catch (err) {
            console.log('Error Dao: Query for getOrderDeliveredProduct Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const getOrderDeliveryProduct = async (payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = Entities.ORDER_DELIVERED_PENDING + '.' + 'id';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            let query: any = getManager()
                .createQueryBuilder()
                .select('"orderId"', 'orderId')
                .addSelect('"productId"', 'productId')
                .addSelect(`${Entities.ORDER}.reference_value`, 'reference_value')
                .addSelect('original_quantity', 'original_quantity')
                .addSelect('delivered_quantity', 'delivered_quantity')
                .addSelect('remaining_quantity', 'remaining_quantity')
                .addSelect('product_code', 'product_code')
                .addSelect('product_name', 'product_name')
                .addSelect(`${Entities.ORDER_DELIVERED_PENDING}.delivered_date`, 'delivered_date')
                .from(useSchemaAndTableName(Entities.ORDER_DELIVERED_PENDING), Entities.ORDER_DELIVERED_PENDING)
                .leftJoin(OrderEntity, `${Entities.ORDER}`, `${Entities.ORDER}.id = ${Entities.ORDER_DELIVERED_PENDING}.orderId`)
                .leftJoin(ProductsEntity, `${Entities.PRODUCTS}`, `${Entities.PRODUCTS}.id = ${Entities.ORDER_DELIVERED_PENDING}.productId`)
                .where(`${Entities.ORDER}.reference_value = '${payload[0].id}'`);

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);

                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        let filter0 = f[0];
                        let filter1 = f[1];
                        query = query.andWhere(`UPPER(${filter0}.${filter1}) Like '%${v.value.toUpperCase()}%' `);
                    } else {
                        query = query.andWhere(`UPPER(${Entities.ORDER_DELIVERED_PENDING}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
                    }
                });
            }

            const count = await query.getCount();

            query
                .skip(pagination.skip)
                .take(pagination.take)
                .orderBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC');

            const results = await query.getRawMany();

            // console.log('-----------results------------');
            // console.log(results);
            // console.log('----------results-------------');

            const total = count;
            let pageCount = Math.ceil(total / pagination.take) || 1;

            return {
                ...HTTP_RESPONSES[HttpResponseType.Success],
                message: 'Successfully Retrieved data.',
                results,
                pagination: { total, current: pagination.current, pageCount }
            };
        } catch (err) {
            console.log('Error Dao: Query for getOrderDeliveryProduct Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const createOrder = async (payload: OrderDaoCreateInterface) => {
        try {
            const customerExist: any = await getManager()
                .createQueryBuilder()
                .select(`${Entities.USER}.name`, 'name')
                .from(useSchemaAndTableName(Entities.CUSTOMER), Entities.CUSTOMER)
                .leftJoin(UserEntity, `${Entities.USER}`, `${Entities.USER}.id = ${Entities.CUSTOMER}.user_id`)
                .where(`${Entities.CUSTOMER}.id = '${payload.customer_id}'`)
                .andWhere(`(customer_status = '' OR customer_status is null OR Upper(customer_status) like  any (array['%DELIVER%', '%PICKED UP%', '%PARTIAL%']))`)

                .getRawMany();

            if (customerExist.length === 0) {
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `Customer has a pending transaction!`
                };
            }

            let o_id: any;
            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    const data: InsertResult = await transactionEntityManager.getRepository(OrderEntity).createQueryBuilder(Entities.ORDER).insert().into(OrderEntity).values(payload).execute();

                    let { id } = data.identifiers[0];

                    o_id = id;

                    payload.products.map(async (v: any) => {
                        const query2 = transactionEntityManager
                            .getRepository(OrderProductEntity)
                            .createQueryBuilder(Entities.ORDER_PRODUCTS)
                            .insert()
                            .into(OrderProductEntity)
                            .values({ quantity: v.quantity, price: v.price, orderId: id, productId: v.id, total: v.quantity * v.price });
                        await query2.execute();

                        // let fq = parseInt(v.orig_fq) - parseInt(v.quantity);

                        // const query3 = transactionEntityManager
                        //     .getRepository(ProductsEntity)
                        //     .createQueryBuilder(Entities.PRODUCTS)
                        //     .update()
                        //     .set({ forecasted_quantity: fq })
                        //     .where('id = :id', { id: v.id });
                        // await query3.execute();
                    });

                    // if (payload.payment_status === 'Paid') {
                    //     await transactionEntityManager
                    //         .getRepository(CustomerEntity)
                    //         .createQueryBuilder(Entities.CUSTOMER)
                    //         .update(CustomerEntity)
                    //         .set({
                    //             customer_balance: payload.account_balance,
                    //             customer_payment_status: payload.payment_status,
                    //             customer_over_payment: payload.over_payment
                    //         })
                    //         .where('id = :id', { id: payload.customer_id })
                    //         .execute();

                    //     await transactionEntityManager
                    //         .getRepository(PaymentEntity)
                    //         .createQueryBuilder(Entities.PAYMENT)
                    //         .insert()
                    //         .into(PaymentEntity)
                    //         .values({
                    //             payment_invoice_id: payload.payment_invoice_id,
                    //             payment_balance: payload.payment_balance,
                    //             payment_amount: payload.payment_amount,
                    //             over_payment: payload.over_payment,
                    //             account_balance: payload.account_balance,
                    //             payment_date: new Date(),
                    //             recent: 'Y'
                    //         })
                    //         .execute();
                    // } else {
                    await transactionEntityManager
                        .getRepository(CustomerEntity)
                        .createQueryBuilder(Entities.CUSTOMER)
                        .update(CustomerEntity)
                        .set({
                            customer_balance: payload.amount_to_pay,
                            customer_payment_status: payload.payment_status,
                            customer_status: 'Pending Invoice'
                        })
                        .where('id = :id', { id: payload.customer_id })
                        .execute();
                    //}

                    return true;
                } catch (err) {
                    console.log('Error Dao: Create Order Dao Transaction -> ', err);
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Created], o_id, message: 'Successfully created.' };
            } else {
                console.log('Error Dao: Create Order Transaction -> ', 'Error Creating Order Transaction!');
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: 'Error Creating Order!'
                };
            }
        } catch (err) {
            console.log('Error Dao: Create Order Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const updateOrder = async (id: string, payload: OrderDaoUpdateInterface) => {
        try {
            if (payload.customer_change === 'Y') {
                const customerExist: any = await getManager()
                    .createQueryBuilder()
                    .select(`${Entities.ORDER}.id`, 'id')
                    .addSelect(`${Entities.USER}.name`, 'name')
                    .from(useSchemaAndTableName(Entities.ORDER), Entities.ORDER)
                    .leftJoin(CustomerEntity, `${Entities.CUSTOMER}`, `${Entities.CUSTOMER}.id = ${Entities.ORDER}.customer_id`)
                    .leftJoin(UserEntity, `${Entities.USER}`, `${Entities.USER}.id = ${Entities.CUSTOMER}.user_id`)
                    .where(`customer_id = '${payload.customer_id}'`)
                    .andWhere(`UPPER(customer_status) != ''`)
                    .getRawMany();

                if (customerExist.length > 0) {
                    return {
                        ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                        message: `Customer ${customerExist[0].name} has pending transaction!`
                    };
                }
            }

            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    // delete all order in order product table where order_id = "id"
                    await transactionEntityManager.getRepository(OrderProductEntity).createQueryBuilder(Entities.ORDER_PRODUCTS).delete().where({ orderId: id }).execute();

                    //update Order table
                    const query = transactionEntityManager
                        .getRepository(OrderEntity)
                        .createQueryBuilder(Entities.ORDER)
                        .update(OrderEntity)
                        .set({
                            customer_id: payload.customer_id,
                            order_status: payload.order_status,
                            payment_status: payload.payment_status,
                            order_date: payload.order_date,
                            amount_to_pay: payload.amount_to_pay
                        })
                        .where('id = :id', { id });
                    await query.execute();

                    // insert payload to order product table
                    payload.products.map(async (v: any) => {
                        const query2 = transactionEntityManager
                            .getRepository(OrderProductEntity)
                            .createQueryBuilder(Entities.ORDER_PRODUCTS)
                            .insert()
                            .into(OrderProductEntity)
                            .values({ quantity: v.quantity, price: v.price, orderId: id, productId: v.id, total: v.quantity * v.price });
                        await query2.execute();
                    });

                    //get sum of quantity per product
                    // const totalProduct: any = await getManager()
                    // .createQueryBuilder()
                    // .select('"productId"', 'productId')
                    // .addSelect('SUM(quantity)', 'quantity')
                    // .from(useSchemaAndTableName(Entities.ORDER_PRODUCTS), Entities.ORDER_PRODUCTS)
                    // .groupBy('"productId"')
                    // //.where('"orderId" = :orderId', { orderId: id})
                    // .execute();

                    // if(totalProduct.length > 0){

                    //     totalProduct.map(async (v:any) =>{
                    //         const origProduct: any = await getManager()
                    //         .createQueryBuilder()
                    //         .select('id', 'id')
                    //         .addSelect('quantity', 'quantity')
                    //         .from(useSchemaAndTableName(Entities.PRODUCTS), Entities.PRODUCTS)
                    //         .where('id = :id', { id: v.productId})
                    //         .execute();

                    //         let fq = parseInt(origProduct[0].quantity) - parseInt(v.quantity);

                    //         const query3 = transactionEntityManager
                    //         .getRepository(ProductsEntity)
                    //         .createQueryBuilder(Entities.PRODUCTS)
                    //         .update()
                    //         .set({ forecasted_quantity: fq })
                    //         .where('id = :id', { id: v.productId });

                    //          await query3.execute();
                    //     })

                    // }

                    // if (payload.payment_status === 'Paid') {
                    //     await transactionEntityManager
                    //         .getRepository(CustomerEntity)
                    //         .createQueryBuilder(Entities.CUSTOMER)
                    //         .update(CustomerEntity)
                    //         .set({
                    //             customer_balance: payload.account_balance,
                    //             customer_payment_status: payload.payment_status,
                    //             customer_over_payment: payload.over_payment
                    //         })
                    //         .where('id = :id', { id: payload.customer_id })
                    //         .execute();

                    //     await transactionEntityManager
                    //         .getRepository(PaymentEntity)
                    //         .createQueryBuilder(Entities.PAYMENT)
                    //         .insert()
                    //         .into(PaymentEntity)
                    //         .values({
                    //             payment_invoice_id: payload.payment_invoice_id,
                    //             payment_balance: payload.payment_balance,
                    //             payment_amount: payload.payment_amount,
                    //             over_payment: payload.over_payment,
                    //             account_balance: payload.account_balance,
                    //             payment_date: new Date(),
                    //             recent: 'Y'
                    //         })
                    //         .execute();
                    // } else {
                    await transactionEntityManager
                        .getRepository(CustomerEntity)
                        .createQueryBuilder(Entities.CUSTOMER)
                        .update(CustomerEntity)
                        .set({
                            customer_balance: payload.amount_to_pay,
                            customer_payment_status: payload.payment_status,
                            customer_status: 'Pending Invoice'
                        })
                        .where('id = :id', { id: payload.customer_id })
                        .execute();
                    //}

                    return true;
                } catch (err) {
                    console.log('Error Dao: Update Order Transaction -> ', 'Error Updating Order!');
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Updated], message: 'Successfully updated.' };
            } else {
                console.log('Error Dao: Update Order Transaction -> ', 'Error Updating Order!');
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: 'Error Updating Order!'
                };
            }
        } catch (err) {
            console.log('Error Dao: update Order -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const updateOrderDeliveryPending = async (id: string, payload: OrderDeliveryPendingDaoUpdateInterface) => {
        try {
            const pendingExist = await getRepository(OrderPendigEntity).createQueryBuilder(Entities.ORDER_PENDING).where(`UPPER(reference_value) = UPPER('${payload.reference_value}')`).getMany();
            if (pendingExist.length > 0) {
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `SI # ${payload.si_number.toUpperCase()} is already pending for approval!`
                };
            }
            const orderMain = await getRepository(OrderEntity).createQueryBuilder(Entities.ORDER).where('id = :id', { id }).getOne();

            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    //INSERT
                    await transactionEntityManager
                        .getRepository(OrderPendigEntity)
                        .createQueryBuilder(Entities.ORDER_PENDING)
                        .insert()
                        .into(OrderPendigEntity)
                        .values({
                            si_number: orderMain?.si_number,
                            customer_id: orderMain?.customer_id,
                            order_date: orderMain?.order_date,
                            amount_to_pay: orderMain?.amount_to_pay,
                            order_status: payload.status,
                            delivered_date: payload.delivered_date,
                            reference_value: orderMain?.reference_value,
                            approval_ind: orderMain?.approval_ind,
                            order_remarks: payload.remarks,
                            request_by: payload.request_by,
                            event_request: payload.event_request,
                            request_date: payload.request_date
                        })
                        .execute();

                    //update Order table
                    const updatedData = await transactionEntityManager
                        .getRepository(OrderEntity)
                        .createQueryBuilder(Entities.ORDER)
                        .update(OrderEntity)
                        .set({
                            approval_ind: 'Y'
                            //order_status: 'Pending Delivery'
                        })
                        .where('id = :id', { id })
                        .returning('customer_id')
                        .execute();

                    //update Customer table
                    await transactionEntityManager
                        .getRepository(CustomerEntity)
                        .createQueryBuilder(Entities.CUSTOMER)
                        .update(CustomerEntity)
                        .set({
                            customer_status: 'Pending Delivery'
                        })
                        .where('id = :id', { id: updatedData.raw[0].customer_id })
                        .execute();

                    // insert payload to order product table
                    payload.products.map(async (v: any) => {
                        const query2 = transactionEntityManager
                            .getRepository(OrderDeliveredPendingEntity)
                            .createQueryBuilder(Entities.ORDER_DELIVERED_PENDING)
                            .insert()
                            .into(OrderDeliveredPendingEntity)
                            .values({
                                original_quantity: v.original_quantity,
                                delivered_quantity: v.delivered_quantity,
                                remaining_quantity: v.remaining_quantity,
                                orderId: id,
                                productId: v.id,
                                delivered_date: payload.delivered_date
                            });
                        await query2.execute();
                    });

                    return true;
                } catch (err) {
                    console.log('Error in ${payload.status} Order Delivery Pending Dao Transaction -> ', err);
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Updated], message: 'Successfully submitted for approval.' };
            } else {
                console.log('Error Dao: Rejecting Order Delivery Pending Transaction -> ', `Error in Order Delivery Pending!`);
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `Error in Order Delivery Pending!`
                };
            }
        } catch (err) {
            console.log('Error Dao: Update Order Delivery Pending -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const approvalOrderDeliveryPending = async (id: string, payload: OrderDeliveryPendingDaoApprovalInterface) => {
        try {
            // await getRepository(InvoiceEntity).createQueryBuilder(Entities.Invoice).update(InvoiceEntity).set(payload).where('id = :id', { id }).execute();

            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    if (payload.transaction_status === 'Rejected') {
                        let existOrderDelivered = await transactionEntityManager
                            .getRepository(OrderEntity)
                            .createQueryBuilder(Entities.ORDER)
                            .select('order_status')
                            .addSelect('customer_id')
                            .where('id = :orderId', { orderId: payload.order_id })
                            .execute();

                        //update Order table
                        await transactionEntityManager
                            .getRepository(OrderEntity)
                            .createQueryBuilder(Entities.ORDER)
                            .update(OrderEntity)
                            .set({
                                approval_ind: 'N',
                                order_status: existOrderDelivered[0].order_status
                            })
                            .where('id = :id', { id: payload.order_id })
                            .execute();

                        //update Customer table
                        await transactionEntityManager
                            .getRepository(CustomerEntity)
                            .createQueryBuilder(Entities.CUSTOMER)
                            .update(CustomerEntity)
                            .set({
                                customer_status: existOrderDelivered[0].order_status
                            })
                            .where('id = :id', { id: existOrderDelivered[0].customer_id })
                            .execute();

                        // delete order pending entity
                        await transactionEntityManager.getRepository(OrderDeliveredPendingEntity).delete({ orderId: payload.order_id });
                    } // if approved
                    else {
                        //update Order table
                        const updatedData = await transactionEntityManager
                            .getRepository(OrderEntity)
                            .createQueryBuilder(Entities.ORDER)
                            .update(OrderEntity)
                            .set({
                                approval_ind: 'N',
                                order_status: payload.order_status,
                                order_remarks: payload.order_remarks,
                                delivered_date: payload.delivered_date
                            })
                            .where('id = :id', { id: payload.order_id })
                            .returning('customer_id')
                            .execute();

                        //update Customer table
                        await transactionEntityManager
                            .getRepository(CustomerEntity)
                            .createQueryBuilder(Entities.CUSTOMER)
                            .update(CustomerEntity)
                            .set({
                                customer_status: payload.order_status
                            })
                            .where('id = :id', { id: updatedData.raw[0].customer_id })
                            .execute();

                        // Update Status if On-going or Scheduled Delivery
                        if (payload.order_status !== 'On-going' && payload.order_status !== 'Scheduled Delivery') {
                            console.log('-----------pumasok----------------------------------');
                            console.log('-------------here--------------------------------');
                            console.log('-------------pag--------------------------------');
                            console.log('--------------not-------------------------------');
                            console.log('--------------ongoin or scheduled-------------------------------');

                            let orderDeliveredPending = await transactionEntityManager
                                .getRepository(OrderDeliveredPendingEntity)
                                .createQueryBuilder(Entities.ORDER_DELIVERED_PENDING)
                                .select('id')
                                .addSelect('original_quantity')
                                .addSelect('delivered_date')
                                .addSelect('delivered_quantity')
                                .addSelect('remaining_quantity')
                                .addSelect('"orderId"', 'order_id')
                                .addSelect('"productId"')
                                .where('"orderId" = :orderId', { orderId: payload.order_id })
                                .execute();

                            let existOrderDelivered = await transactionEntityManager
                                .getRepository(OrderDeliveredEntity)
                                .createQueryBuilder(Entities.ORDER_DELIVERED)
                                .select('id')
                                .addSelect('delivered_quantity')
                                .addSelect('delivered_date')
                                .where('"orderId" = :orderId', { orderId: payload.order_id })
                                .execute();

                            //Update Order Delivered
                            if (existOrderDelivered.length > 0) {
                                orderDeliveredPending.map(async (v: any) => {
                                    //SELECT PRODUCT ORDERED_QUANTITY
                                    let product = await transactionEntityManager
                                        .getRepository(ProductsEntity)
                                        .createQueryBuilder(Entities.PRODUCTS)
                                        .select('quantity')
                                        .where('id = :productId', { productId: v.productId })
                                        .execute();

                                    await transactionEntityManager
                                        .getRepository(OrderDeliveredEntity)
                                        .createQueryBuilder(Entities.ORDER_DELIVERED)
                                        .update(OrderDeliveredEntity)
                                        .set({
                                            delivered_quantity: parseInt(existOrderDelivered[0].delivered_quantity) + parseInt(v.delivered_quantity),
                                            remaining_quantity: v.remaining_quantity,
                                            delivered_date: existOrderDelivered[0].delivered_date
                                        })
                                        .where('"orderId" = :orderId', { orderId: payload.order_id })
                                        .andWhere('"productId" = :productId', { productId: v.productId })
                                        .execute();

                                    // UPDATE INVENTORY
                                    await transactionEntityManager
                                        .getRepository(ProductsEntity)
                                        .createQueryBuilder(Entities.PRODUCTS)
                                        .update(ProductsEntity)
                                        .set({
                                            quantity: parseInt(product[0].quantity) - parseInt(v.delivered_quantity)
                                        })
                                        .where('id = :productId', { productId: v.productId })
                                        .execute();
                                });
                            } //Insert Order Delivered
                            else {
                                orderDeliveredPending.map(async (v: any) => {
                                    //SELECT PRODUCT ORDERED_QUANTITY
                                    let product = await transactionEntityManager
                                        .getRepository(ProductsEntity)
                                        .createQueryBuilder(Entities.PRODUCTS)
                                        .select('quantity')
                                        .where('id = :productId', { productId: v.productId })
                                        .execute();

                                    await transactionEntityManager
                                        .getRepository(OrderDeliveredEntity)
                                        .createQueryBuilder(Entities.ORDER_DELIVERED)
                                        .insert()
                                        .into(OrderDeliveredEntity)
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

                                    // UPDATE INVENTORY
                                    await transactionEntityManager
                                        .getRepository(ProductsEntity)
                                        .createQueryBuilder(Entities.PRODUCTS)
                                        .update(ProductsEntity)
                                        .set({
                                            quantity: parseInt(product[0].quantity) - parseInt(v.delivered_quantity)
                                        })
                                        .where('id = :productId', { productId: v.productId })
                                        .execute();
                                });
                            }
                        } else {
                            console.log('-----------not pumasok----------------------------------');
                            console.log('-------------here--------------------------------');
                            console.log('-------------pag--------------------------------');
                            console.log('--------------not-------------------------------');
                            console.log('--------------ongoin or scheduled-------------------------------');
                        }
                    }

                    //delete order pending
                    await transactionEntityManager.getRepository(OrderPendigEntity).delete({ id });

                    // delete order pending entity
                    await transactionEntityManager.getRepository(OrderDeliveredPendingEntity).delete({ orderId: payload.order_id });

                    return true;
                } catch (err) {
                    console.log(`Error in ${payload.status} Order Approval Delivery Pending Dao Transaction -> `, err);
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Approval], message: `Successfully ${payload.transaction_status}.` };
            } else {
                console.log('Error Dao: Rejecting Order Approval Delivery Pending Transaction -> ', `Error in ${payload.transaction_status} Order Delivery Pending!`);
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `Error in ${payload.transaction_status} Order Delivery Pending!`
                };
            }
        } catch (err) {
            console.log('Error Dao: Order Approval Delivery  Pending -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const deleteOrder = async (id: string, _payload: OrderDaoDeleteInterface) => {
        try {
            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    let p = id.split('|');

                    // delete all order in order product table where order_id = "id"
                    await transactionEntityManager.getRepository(OrderProductEntity).createQueryBuilder(Entities.ORDER_PRODUCTS).delete().where({ orderId: p[0] }).execute();

                    // delete record in table order
                    await transactionEntityManager.getRepository(OrderEntity).delete({ id: p[0] });

                    //update customer balance & status
                    await transactionEntityManager
                        .getRepository(CustomerEntity)
                        .createQueryBuilder(Entities.CUSTOMER)
                        .update(CustomerEntity)
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
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Deleted], message: 'Successfully deleted.' };
            } else {
                console.log('Error Dao: delete Order -> ', 'Error Deleting Order!');
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: 'Error Deleting Order!'
                };
            }
        } catch (err) {
            console.log('Error Dao: delete Order -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const restoreOrder = async (id: string, payload: OrderDaoRestoreInterface) => {
        try {
            await getRepository(OrderEntity)
                .createQueryBuilder(Entities.ORDER)
                .update(OrderEntity)
                .set({ ...payload, updated_at: new Date() })
                .where('id = :id', { id })
                .execute();
            await getRepository(OrderEntity).restore({ id });
            return { ...HTTP_RESPONSES[HttpResponseType.Restored], message: 'Successfully restored.' };
        } catch (err) {
            console.log('Error Dao: restoreOrder -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const getOrderReport = async (request: OrderRouteInterface) => {
        try {
            let df_value = request!.df as string;
            let dt_value = request!.dt as string;

            let df_date: any = moment(new Date(df_value)).format('DD/MM/yyyy');
            let dt_date: any = moment(new Date(dt_value)).add(1, 'day').format('DD/MM/yyyy');

            let queries: FindManyOptions<OrderEntity> = {
                relations: ['order_customer'],
                where: { created_at: Between(df_date, dt_date) },
                order: { created_at: 'ASC' }
            };

            const results = await OrderEntity.find(queries);

            return {
                ...HTTP_RESPONSES[HttpResponseType.Success],
                message: 'Successfully Retrieved data.',
                results
            };
        } catch (err) {
            console.log('Error Dao: Query for getOrderReport Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

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

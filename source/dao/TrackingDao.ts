import { TrackingDaoCreateInterface, TrackingDaoDeleteInterface, TrackingDaoRestoreInterface, TrackingDaoUpdateInterface } from 'source/interfaces/dao/TrackingDaoInterface';
import { CustomerEntity } from './../entities/CustomerEntities';
import { OrderDeliveredEntity } from './../entities/OrderDeliveredEntities';
import { ProductsEntity } from './../entities/ProductEntities';
import { RoleEntity } from './../entities/RoleEntities';
import { TrackingMainEntity } from './../entities/TrackingMainEntities';
import { UserEntity } from './../entities/UserEntities';
import { useSchemaAndTableName } from './../util/Schema';

import { getManager, InsertResult } from 'typeorm';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { PaginationDaoInterface } from '../interfaces/dao/PaginationDaoInterface';
import { Entities } from './../constant/Entities';
import { TrackingEntity } from './../entities/TrackingEntities';
import { HeadersRouteInterface } from './../interfaces/routes/HttpRoutesInterface';

export const useTrackingDao = () => {
    const getOrdersForTracking = async (payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = Entities.ORDER + '.' + 'created_at';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            let where = '';

            if (payload.length > 0) {
                let role = payload[1].role_name ? payload[1].role_name._value : '';
                if (role.indexOf('super_admin') > -1) {
                    where = `${Entities.ORDER}.order_status in ('Delivered' , 'Partially Delivered', 'Picked Up', 'Partially Picked Up', 'On-going', 'Scheduled Delivery')`;
                } else {
                    where = `${Entities.CUSTOMER}.user_id = '${payload[0].customer_name}' AND ${Entities.ORDER}.order_status in ('Delivered' , 'Partially Delivered', 'Picked Up', 'Partially Picked Up', 'On-going', 'Scheduled Delivery')`;
                }
            }

            const o = useSchemaAndTableName(Entities.ORDER);
            const op = useSchemaAndTableName(Entities.ORDER_DELIVERED);
            const od = useSchemaAndTableName(Entities.ORDER_DISTRIBUTED_MAIN);

            const totalOrders: any = getManager()
                .createQueryBuilder()
                .select('"orderId"', 'orderId')
                .addSelect('SUM(original_quantity)', 'original_quantity')
                .addSelect('SUM(delivered_quantity)', 'delivered_quantity')
                .from(op, Entities.ORDER_DELIVERED)
                .groupBy('"orderId"');

            const totalDistributed: any = getManager()
                .createQueryBuilder()
                .select('"order_id"', 'order_id')
                .addSelect('MAX(reference_value)', 'reference_value')
                .addSelect('SUM(distributed_quantity)', 'distributed_quantity')
                .from(od, Entities.ORDER_DISTRIBUTED_MAIN)
                .groupBy('"order_id"');

            let query: any = getManager()
                .createQueryBuilder()
                .select(`${Entities.ORDER}.id`, 'id')
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
                .addSelect(`${Entities.USER}.name`, 'name')
                .addSelect(`${Entities.USER}.contact_number`, 'contact_number')
                .addSelect(`${Entities.USER}.address`, 'address')
                .addSelect(`${Entities.ROLES}.role_description`, 'role')
                .addSelect(`${Entities.CUSTOMER}.customer_over_payment`, 'over_payment')
                .from(o, Entities.ORDER)
                .leftJoin('(' + totalOrders.getQuery() + ')', 'total_orders', `total_orders."orderId" = ${Entities.ORDER}.id`)
                .leftJoin('(' + totalDistributed.getQuery() + ')', 'total_distributed_main', `total_distributed_main."order_id" = ${Entities.ORDER}.id`)
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
            console.log('Error Dao: Query for getOrdersForTracking Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const getTracking = async (payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = Entities.ORDER_DISTRIBUTED + '.' + 'created_at';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            let where = '';

            if (payload.length > 0) {
                if (payload[0].Tracking_status.indexOf('|') > -1) {
                    let p = payload[0].Tracking_status.split('|');

                    let whereIn = '';
                    for (let i = 0; i < p.length; i++) {
                        whereIn += `'${p[i]}'`;

                        if (i + 1 !== p.length) whereIn += ',';
                    }

                    where = `Tracking_status in (${whereIn})`;
                } else where = `Upper(Tracking_status) = Upper('${payload[0].Tracking_status}')`;
            }

            // if (!defaultSort.includes('.')) {
            //     defaultSort = Entities.ORDER_DISTRIBUTED + '.' + defaultSort;
            // } else {
            //     if (defaultSort === 'Tracking_customer.user.name') {
            //         defaultSort = Entities.USER + '.name';
            //     }
            // }

            // let query = getRepository(TrackingEntity)
            //     .createQueryBuilder(Entities.ORDER_DISTRIBUTED)
            //     // first argument = san entity kukunin para ilagay TrackingEntity.Tracking_customer,
            //     // second argument = san ijoin na table
            //     // third argument = alias ng join table
            //     // fourth argument = san mag On
            //     .leftJoinAndMapOne(`${Entities.ORDER_DISTRIBUTED}.Tracking_customer`, CustomerEntity, `${Entities.CUSTOMER}`, `${Entities.CUSTOMER}.id = ${Entities.ORDER_DISTRIBUTED}.customer_id`)
            //     .leftJoinAndMapOne(`${Entities.CUSTOMER}.user`, UserEntity, `${Entities.USER}`, `${Entities.USER}.id = ${Entities.CUSTOMER}.user_id`)
            //     .leftJoinAndMapOne(`${Entities.USER}.role`, RoleEntity, `${Entities.ROLES}`, `${Entities.ROLES}.id = ${Entities.USER}.role_id`)
            //     .leftJoinAndMapMany(`${Entities.ORDER_DISTRIBUTED}.Tracking_products`, TrackingProductEntity, `${Entities.ORDER_DISTRIBUTED_PRODUCTS}`, `${Entities.ORDER_DISTRIBUTED_PRODUCTS}.TrackingId = ${Entities.ORDER_DISTRIBUTED}.id`)
            //     .leftJoinAndMapOne(`${Entities.ORDER_DISTRIBUTED_PRODUCTS}.product`, ProductsEntity, `${Entities.PRODUCTS}`, `${Entities.PRODUCTS}.id = ${Entities.ORDER_DISTRIBUTED_PRODUCTS}.productId`);

            const o = useSchemaAndTableName(Entities.ORDER_DISTRIBUTED);
            const op = useSchemaAndTableName(Entities.ORDER_PRODUCTS);

            const totalTrackings: any = getManager()
                .createQueryBuilder()
                .select('"trackingId"', 'TrackingId')
                .addSelect('SUM(quantity)', 'quantity')
                .from(op, Entities.ORDER_PRODUCTS)
                .groupBy('"trackingId"');

            let query: any = getManager()
                .createQueryBuilder()
                .select(`${Entities.ORDER_DISTRIBUTED}.id`, 'id')
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
                .addSelect(`${Entities.USER}.name`, 'name')
                .addSelect(`${Entities.USER}.contact_number`, 'contact_number')
                .addSelect(`${Entities.USER}.address`, 'address')
                .addSelect(`${Entities.ROLES}.role_description`, 'role')
                .addSelect(`${Entities.CUSTOMER}.customer_over_payment`, 'over_payment')
                .from(o, Entities.ORDER_DISTRIBUTED)
                .leftJoin('(' + totalTrackings.getQuery() + ')', 'total_Trackings', `total_Trackings."TrackingId" = ${Entities.ORDER_DISTRIBUTED}.id`)
                .leftJoin(CustomerEntity, `${Entities.CUSTOMER}`, `${Entities.CUSTOMER}.id = ${Entities.ORDER_DISTRIBUTED}.customer_id`)
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
                        let w = `${Entities.ORDER_DISTRIBUTED}.${v.id}`;
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
                .TrackingBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC');

            //raw mayn offset limit
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
            console.log('Error Dao: Query for getTrackingDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const getOrderDistributed = async (payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = Entities.ORDER_DISTRIBUTED + '.' + 'id';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            const o = useSchemaAndTableName(Entities.ORDER_DISTRIBUTED);

            let param = payload[0].id.split('|');

            // console.log('----------------------------------');
            // console.log(param);
            // console.log('----------------------------------');

            const orderExist: any = await getManager()
                .createQueryBuilder()
                .select(`${Entities.ORDER}.si_number`, 'si_number')
                .from(useSchemaAndTableName(Entities.ORDER), Entities.ORDER)
                .where(`${Entities.ORDER}.id = '${param[2]}'`)
                .andWhere(`${Entities.ORDER}.si_number = '${param[3]}'`)
                .getRawMany();

            if (orderExist.length === 0) {
                console.log('Error Dao: Query for getOrderDistributed Transaction -> ');
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: 'No Order for that si number!'
                };
            }

            let query: any = getManager()
                .createQueryBuilder()
                .select(`${Entities.ORDER_DISTRIBUTED}.id`, 'id')
                .addSelect(`${Entities.ORDER_DISTRIBUTED}.quantity`, 'quantity')
                .addSelect('date_distributed', 'date_distributed')
                .addSelect(`${Entities.ORDER_DISTRIBUTED}.reference_value`, 'reference_value')
                .addSelect('"productId"', 'product_id')
                .addSelect('"customerId"', 'customer_id')
                .addSelect(`${Entities.PRODUCTS}.product_code`, 'product_code')
                .addSelect(`${Entities.PRODUCTS}.product_name`, 'product_name')
                .addSelect(`${Entities.USER}.name`, 'name')
                .addSelect(`${Entities.USER}.id`, 'user_id')
                .from(o, Entities.ORDER_DISTRIBUTED)
                .leftJoin(TrackingMainEntity, `${Entities.ORDER_DISTRIBUTED_MAIN}`, `${Entities.ORDER_DISTRIBUTED_MAIN}.reference_value = ${Entities.ORDER_DISTRIBUTED}.reference_value`)
                .leftJoin(ProductsEntity, `${Entities.PRODUCTS}`, `${Entities.PRODUCTS}.id = ${Entities.ORDER_DISTRIBUTED}.productId`)
                .leftJoin(UserEntity, `${Entities.USER}`, `${Entities.USER}.id = ${Entities.ORDER_DISTRIBUTED}."customerId"`)
                .where(`${Entities.ORDER_DISTRIBUTED_MAIN}."order_id" = :orderId`, { orderId: param[2] });

            // let query = getRepository(OrderDeliveredEntity)
            //     .createQueryBuilder(Entities.ORDER_DELIVERED)
            //     .leftJoinAndSelect(`${Entities.ORDER_DELIVERED}.product`, 'product', `product.id = ${Entities.ORDER_DELIVERED}.productId`)

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);

                // console.log('------------------');
                // console.log(filters);
                // console.log('------------------');

                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        let filter0 = f[0];
                        let filter1 = f[1];
                        query = query.andWhere(`UPPER(${filter0}.${filter1}) Like '%${v.value.toUpperCase()}%' `);
                    } else {
                        if (v.id === 'name') query = query.andWhere(`UPPER(${Entities.USER}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
                        else if (v.id === 'product_code') query = query.andWhere(`UPPER(${Entities.PRODUCTS}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
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
            console.log('Error Dao: Query for getOrderDistributed Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const createTracking = async (payload: TrackingDaoCreateInterface) => {
        try {
            let o_id: any;
            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    const data: InsertResult = await transactionEntityManager
                        .getRepository(TrackingMainEntity)
                        .createQueryBuilder(Entities.ORDER_DISTRIBUTED_MAIN)
                        .insert()
                        .into(TrackingMainEntity)
                        .values({
                            user_id: payload.user_id,
                            order_id: payload.order_id,
                            reference_value: payload.reference_value,
                            distributed_quantity: payload.distributed_quantity
                        })
                        .execute();

                    let { id } = data.identifiers[0];

                    o_id = id;

                    await Promise.all(
                        payload.products.map(async (v: any) => {
                            let d: any = 0;
                            let distributed_quantity = await transactionEntityManager
                                .getRepository(OrderDeliveredEntity)
                                .createQueryBuilder(Entities.ORDER_DELIVERED)
                                .select('distributed_quantity')
                                .where('"orderId" = :orderId', { orderId: payload.order_id })
                                .andWhere('"productId" = :productId', { productId: v.id })
                                .execute();

                            if (distributed_quantity === null || distributed_quantity === undefined) {
                                d = 0;
                            } else {
                                d = distributed_quantity[0].distributed_quantity === null ? 0 : distributed_quantity[0].distributed_quantity;
                            }

                            await transactionEntityManager
                                .getRepository(OrderDeliveredEntity)
                                .createQueryBuilder(Entities.ORDER_DELIVERED)
                                .update(OrderDeliveredEntity)
                                .set({
                                    distributed_quantity: parseInt(d) + parseInt(v.quantity)
                                })
                                .where('"orderId" = :orderId', { orderId: payload.order_id })
                                .andWhere('"productId" = :productId', { productId: v.id })
                                .execute();

                            const query2 = transactionEntityManager.getRepository(TrackingEntity).createQueryBuilder(Entities.ORDER_DISTRIBUTED).insert().into(TrackingEntity).values({
                                date_distributed: payload.date_distributed,
                                quantity: v.quantity,
                                customerId: payload.customer_id,
                                productId: v.id,
                                reference_value: payload.reference_value
                            });
                            await query2.execute();
                        })
                    );

                    return true;
                } catch (err) {
                    console.log('Error Dao: Create Tracking Dao Transaction -> ', err);
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Created], o_id, message: 'Successfully created.' };
            } else {
                console.log('Error Dao: Create Tracking Transaction -> ', 'Error Creating Tracking Transaction!');
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: 'Error Creating Tracking!'
                };
            }
        } catch (err) {
            console.log('Error Dao: Create Tracking Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const updateTracking = async (id: string, payload: TrackingDaoUpdateInterface) => {
        try {
            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    let d_main: any = 0;
                    let d_order: any = 0;

                    let distributed_quantity_main = await transactionEntityManager
                        .getRepository(TrackingMainEntity)
                        .createQueryBuilder(Entities.ORDER_DISTRIBUTED_MAIN)
                        .select('distributed_quantity')
                        .where('"order_id" = :orderId', { orderId: payload.order_id })
                        .andWhere('reference_value = :reference_value', { reference_value: payload.reference_value })
                        .execute();

                    if (distributed_quantity_main === null || distributed_quantity_main === undefined) {
                        d_main = parseInt(payload.original_quantity.toString()) + parseInt(payload.distributed_quantity.toString());
                    } else {
                        d_main = parseInt(distributed_quantity_main[0].distributed_quantity) - parseInt(payload.original_quantity.toString()) + parseInt(payload.distributed_quantity.toString());
                    }

                    let distributed_quantity_delivered = await transactionEntityManager
                        .getRepository(OrderDeliveredEntity)
                        .createQueryBuilder(Entities.ORDER_DELIVERED)
                        .select('distributed_quantity')
                        .where('"orderId" = :orderId', { orderId: payload.order_id })
                        .andWhere('"productId" = :productId', { productId: payload.product_id })
                        .execute();

                    if (distributed_quantity_delivered === null || distributed_quantity_delivered === undefined) {
                        d_order = parseInt(payload.original_quantity.toString()) + parseInt(payload.distributed_quantity.toString());
                    } else {
                        d_order = parseInt(distributed_quantity_delivered[0].distributed_quantity) - parseInt(payload.original_quantity.toString()) + parseInt(payload.distributed_quantity.toString());
                    }

                    // console.log('--------------------------');
                    // console.log(d_order);
                    // console.log(distributed_quantity_delivered[0].distributed_quantity);
                    // console.log(payload.original_quantity);
                    // console.log(payload.distributed_quantity);
                    // console.log('--------------------------');

                    //UPDATE ORDER DISTRIBUTED
                    await transactionEntityManager
                        .getRepository(TrackingEntity)
                        .createQueryBuilder(Entities.ORDER_DISTRIBUTED)
                        .update(TrackingEntity)
                        .set({
                            quantity: payload.distributed_quantity,
                            date_distributed: payload.date_distributed,
                            customerId: payload.customer_id
                        })
                        .where('id = :id', { id: id })
                        .execute();

                    //UPDATE ORDER DISTRIBUTED MAIN
                    await transactionEntityManager
                        .getRepository(TrackingMainEntity)
                        .createQueryBuilder(Entities.ORDER_DISTRIBUTED_MAIN)
                        .update(TrackingMainEntity)
                        .set({
                            distributed_quantity: d_main
                        })
                        .where('"order_id" = :orderId', { orderId: payload.order_id })
                        .andWhere('reference_value = :reference_value', { reference_value: payload.reference_value })
                        .execute();

                    //UPDATE ORDER DELIVERED
                    await transactionEntityManager
                        .getRepository(OrderDeliveredEntity)
                        .createQueryBuilder(Entities.ORDER_DELIVERED)
                        .update(OrderDeliveredEntity)
                        .set({
                            distributed_quantity: d_order
                        })
                        .where('"orderId" = :orderId', { orderId: payload.order_id })
                        .andWhere('"productId" = :productId', { productId: payload.product_id })
                        .execute();

                    return true;
                } catch (err) {
                    console.log('Error Dao: Update Tracking Transaction -> ', 'Error Updating Tracking!');
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Updated], message: 'Successfully updated.' };
            } else {
                console.log('Error Dao: Update Tracking Transaction -> ', 'Error Updating Tracking!');
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: 'Error Updating Tracking!'
                };
            }
        } catch (err) {
            console.log('Error Dao: update Tracking -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const deleteTracking = async (id: string, _payload: TrackingDaoDeleteInterface) => {
        try {
            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    let p = id.split('|');
                    let d_order: any = 0;
                    let no_other_ref = await transactionEntityManager
                        .getRepository(TrackingEntity)
                        .createQueryBuilder(Entities.ORDER_DISTRIBUTED)
                        .select('id')
                        .addSelect('quantity')
                        .where('reference_value = :reference_value', { reference_value: p[1] })
                        .execute();

                    let order_distributed_main = await transactionEntityManager
                        .getRepository(TrackingMainEntity)
                        .createQueryBuilder(Entities.ORDER_DISTRIBUTED_MAIN)
                        .select('"order_id"', 'order_id')
                        .addSelect(`${Entities.ORDER_DELIVERED}.distributed_quantity`, 'distributed_quantity')
                        .addSelect(`${Entities.ORDER_DISTRIBUTED_MAIN}.distributed_quantity`, 'main_distributed_quantity')
                        .leftJoin(OrderDeliveredEntity, `${Entities.ORDER_DELIVERED}`, `${Entities.ORDER_DELIVERED}."orderId" = ${Entities.ORDER_DISTRIBUTED_MAIN}.order_id`)
                        .where(`${Entities.ORDER_DISTRIBUTED_MAIN}.reference_value = :reference_value`, { reference_value: p[1] })
                        .execute();

                    //
                    if (no_other_ref.length === 1) {
                        console.log('-----------no_other_ref.length === 1---------------');
                        d_order = parseInt(order_distributed_main[0].distributed_quantity) - parseInt(no_other_ref[0].quantity);

                        //UPDATE ORDER DELIVERED
                        await transactionEntityManager
                            .getRepository(OrderDeliveredEntity)
                            .createQueryBuilder(Entities.ORDER_DELIVERED)
                            .update(OrderDeliveredEntity)
                            .set({
                                distributed_quantity: d_order
                            })
                            .where('"orderId" = :orderId', { orderId: order_distributed_main[0].order_id })
                            .andWhere('"productId" = :productId', { productId: p[2] })
                            .execute();

                        // delete record in table Tracking
                        await transactionEntityManager.getRepository(TrackingEntity).delete({ id: p[0] });

                        //delete all Tracking in Tracking product table where Tracking_id = "id"
                        await transactionEntityManager
                            .getRepository(TrackingMainEntity)
                            .createQueryBuilder(Entities.ORDER_DISTRIBUTED_MAIN)
                            .delete()
                            .where('reference_value = :reference_value', { reference_value: p[1] })
                            .execute();
                    } else {
                        console.log('-----------no_other_ref.length > 1---------------');
                        let q = no_other_ref.find((c: any) => c.id === p[0]);
                        d_order = parseInt(order_distributed_main[0].distributed_quantity) - parseInt(q.quantity);

                        // UPDATE ORDER DELIVERED
                        await transactionEntityManager
                            .getRepository(OrderDeliveredEntity)
                            .createQueryBuilder(Entities.ORDER_DELIVERED)
                            .update(OrderDeliveredEntity)
                            .set({
                                distributed_quantity: d_order
                            })
                            .where('"orderId" = :orderId', { orderId: order_distributed_main[0].order_id })
                            .andWhere('"productId" = :productId', { productId: p[2] })
                            .execute();

                        // UPDATE ORDER DISTRIBUTED MAIN
                        await transactionEntityManager
                            .getRepository(TrackingMainEntity)
                            .createQueryBuilder(Entities.ORDER_DISTRIBUTED_MAIN)
                            .update(TrackingMainEntity)
                            .set({
                                distributed_quantity: parseInt(order_distributed_main[0].main_distributed_quantity.toString()) - parseInt(q.quantity)
                            })
                            .where('reference_value = :reference_value', { reference_value: p[1] })
                            .execute();
                        // // delete record in table Tracking
                        await transactionEntityManager.getRepository(TrackingEntity).delete({ id: p[0] });
                    }

                    return true;
                } catch (err) {
                    console.log('Error Dao: delete Tracking -> ', err);
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Deleted], message: 'Successfully deleted.' };
            } else {
                console.log('Error Dao: delete Tracking -> ', 'Error Deleting Tracking!');
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: 'Error Deleting Tracking!'
                };
            }
        } catch (err) {
            console.log('Error Dao: delete Tracking -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const restoreTracking = async (_id: string, _payload: TrackingDaoRestoreInterface) => {
        try {
            // await getRepository(TrackingEntity)
            //     .createQueryBuilder(Entities.ORDER_DISTRIBUTED)
            //     .update(TrackingEntity)
            //     .set({ ...payload, updated_at: new Date() })
            //     .where('id = :id', { id })
            //     .execute();
            // await getRepository(TrackingEntity).restore({ id });
            return { ...HTTP_RESPONSES[HttpResponseType.Restored], message: 'Successfully restored.' };
        } catch (err) {
            console.log('Error Dao: restoreTracking -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    // const getTrackingReport = async (request: TrackingRouteInterface) => {
    //     try {
    //         let df_value = request!.df as string;
    //         let dt_value = request!.dt as string;

    //         let df_date: any = moment(new Date(df_value)).format('DD/MM/yyyy');
    //         let dt_date: any = moment(new Date(dt_value)).add(1, 'day').format('DD/MM/yyyy');

    //         let queries: FindManyOptions<TrackingEntity> = {
    //             relations: ['Tracking_customer'],
    //             where: { created_at: Between(df_date, dt_date) },
    //             tracking: { created_at: 'ASC' }
    //         };

    //         const results = await TrackingEntity.find(queries);

    //         return {
    //             ...HTTP_RESPONSES[HttpResponseType.Success],
    //             message: 'Successfully Retrieved data.',
    //             results
    //         };
    //     } catch (err) {
    //         console.log('Error Dao: Query for getTrackingReport Transaction -> ', err);
    //         return {
    //             ...HTTP_RESPONSES[HttpResponseType.BadRequest],
    //             message: err.message
    //         };
    //     }
    // };

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

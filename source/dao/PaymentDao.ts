import { PaymentDaoCreateInterface, PaymentDaoDeleteInterface, PaymentDaoRestoreInterface, PaymentDaoUpdateInterface } from 'source/interfaces/dao/PaymentDaoInterface';
import { getManager, getRepository, InsertResult } from 'typeorm';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { PaginationDaoInterface } from '../interfaces/dao/PaginationDaoInterface';
import { Entities } from './../constant/Entities';
import { AreaEntity } from './../entities/AreaEntities';
import { CustomerEntity } from './../entities/CustomerEntities';
import { InvoiceEntity } from './../entities/InvoiceEntities';
import { OrderEntity } from './../entities/OrderEntities';
import { PaymentEntity } from './../entities/PaymentEntities';
import { RoleEntity } from './../entities/RoleEntities';
import { UserEntity } from './../entities/UserEntities';
import { HeadersRouteInterface } from './../interfaces/routes/HttpRoutesInterface';
import { useSchemaAndTableName } from './../util/Schema';

export const usePaymentDao = () => {
    const getPayment = async (_payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = Entities.PAYMENT + '.' + 'payment_date';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            const o = useSchemaAndTableName(Entities.PAYMENT);

            const paymentGroup: any = getManager()
                .createQueryBuilder()
                .select('payment_invoice_id', 'payment_invoice_id')
                .addSelect('MAX(payment_date)', 'payment_date')
                .from(o, Entities.PAYMENT)
                .groupBy('payment_invoice_id');

            let query: any = getManager()
                .createQueryBuilder()
                .select(`${Entities.PAYMENT}.id`, 'id')
                .addSelect(`${Entities.INVOICE}.invoice_code`, 'invoice_code')
                .addSelect(`${Entities.INVOICE}.invoice_order_id`, 'invoice_order_id')
                .addSelect(`${Entities.INVOICE}.total_order`, 'total_order')
                .addSelect(`${Entities.ORDER}.si_number`, 'si_number')
                .addSelect(`${Entities.ORDER}.order_date`, 'order_date')
                .addSelect(`${Entities.USER}.name`, 'name')
                .addSelect(`${Entities.USER}.address`, 'address')
                .addSelect(`${Entities.USER}.contact_number`, 'contact_number')
                .addSelect(`${Entities.ROLES}.role_description`, 'role')
                .addSelect(`${Entities.PAYMENT}.payment_invoice_id`, 'payment_invoice_id')
                .addSelect(`${Entities.PAYMENT}.previous_over_payment`, 'previous_over_payment')
                .addSelect(`${Entities.PAYMENT}.payment_amount`, 'payment_amount')
                .addSelect(`${Entities.PAYMENT}.payment_balance`, 'payment_balance')
                .addSelect(`${Entities.PAYMENT}.over_payment`, 'over_payment')
                .addSelect(`${Entities.PAYMENT}.account_balance`, 'account_balance')
                .addSelect(`${Entities.PAYMENT}.payment_date`, 'payment_date')
                .addSelect(`${Entities.PAYMENT}.description`, 'description')
                .addSelect(`${Entities.CUSTOMER}.fully_paid`, 'fully_paid')
                .addSelect(`${Entities.AREA}.area_name`, 'customer_area')

                .from(o, Entities.PAYMENT)
                .innerJoin(
                    '(' + paymentGroup.getQuery() + ')',
                    'payment_group',
                    `payment_group.payment_invoice_id = ${Entities.PAYMENT}.payment_invoice_id and payment_group.payment_date = ${Entities.PAYMENT}.payment_date`
                )
                //.leftJoin(OrderEntity, `${Entities.ORDER}`, `${Entities.ORDER}.id = ${Entities.PAYMENT}.payment_order_id`)
                .leftJoin(InvoiceEntity, `${Entities.INVOICE}`, `${Entities.INVOICE}.id = ${Entities.PAYMENT}.payment_invoice_id`)
                .leftJoin(OrderEntity, `${Entities.ORDER}`, `${Entities.ORDER}.id = ${Entities.INVOICE}.invoice_order_id`)
                .leftJoin(CustomerEntity, `${Entities.CUSTOMER}`, `${Entities.CUSTOMER}.id = ${Entities.ORDER}.customer_id`)
                .leftJoin(UserEntity, `${Entities.USER}`, `${Entities.USER}.id = ${Entities.CUSTOMER}.user_id`)
                .leftJoin(RoleEntity, `${Entities.ROLES}`, `${Entities.ROLES}.id = ${Entities.USER}.role_id`)
                .leftJoin(AreaEntity, `${Entities.AREA}`, `${Entities.AREA}.id = ${Entities.CUSTOMER}.customer_area`);

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);

                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        let filter0 = f[0];
                        let filter1 = f[1];
                        query = query.andWhere(`UPPER(${filter0}.${filter1}) Like '%${v.value.toUpperCase()}%' `);
                    } else {
                        let from = Entities.PAYMENT;
                        if (v.id === 'si_number') from = Entities.ORDER;
                        else if (v.id === 'name') from = Entities.USER;
                        else if (v.id === 'invoice_code') from = Entities.INVOICE;

                        query = query.andWhere(`UPPER(${from}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
                    }
                });
            }

            const count = await query.getCount();

            query
                .offset(pagination.skip)
                .limit(pagination.take)
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
            console.log('Error Dao: Query for getPaymentDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const getPaymentHistory = async (payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = Entities.PAYMENT + '.' + 'payment_date';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            const o = useSchemaAndTableName(Entities.PAYMENT);
            //const op = useSchemaAndTableName(Entities.ORDER_PRODUCTS);

            // const totalOrders: any = getManager().createQueryBuilder().select('"orderId"', 'orderId').addSelect('SUM(total)', 'total').from(op, Entities.ORDER_PRODUCTS).groupBy('"orderId"');

            let query: any = getManager()
                .createQueryBuilder()
                .select(`${Entities.PAYMENT}.id`, 'id')
                .addSelect(`${Entities.USER}.name`, 'name')
                .addSelect(`${Entities.USER}.address`, 'address')
                .addSelect(`${Entities.CUSTOMER}.customer_area`, 'customer_area')
                .addSelect(`${Entities.ORDER}.si_number`, 'si_number')
                .addSelect(`${Entities.ORDER}.order_date`, 'order_date')
                .addSelect(`${Entities.INVOICE}.invoice_code`, 'invoice_code')
                .addSelect(`${Entities.INVOICE}.total_order`, 'total_order')
                .addSelect(`${Entities.PAYMENT}.payment_invoice_id`, 'payment_invoice_id')
                .addSelect(`${Entities.PAYMENT}.payment_amount`, 'payment_amount')
                .addSelect(`${Entities.PAYMENT}.payment_balance`, 'payment_balance')
                .addSelect(`${Entities.PAYMENT}.over_payment`, 'over_payment')
                .addSelect(`${Entities.PAYMENT}.account_balance`, 'account_balance')
                .addSelect(`${Entities.PAYMENT}.payment_date`, 'payment_date')
                .addSelect(`${Entities.PAYMENT}.previous_over_payment`, 'previous_over_payment')
                .addSelect(`${Entities.PAYMENT}.recent`, 'recent')
                .addSelect(`${Entities.PAYMENT}.description`, 'description')
                .from(o, Entities.PAYMENT)
                //.leftJoin('(' + totalOrders.getQuery() + ')', 'total_orders', `total_orders."orderId" = ${Entities.ORDER}.id`)
                .leftJoin(InvoiceEntity, `${Entities.INVOICE}`, `${Entities.INVOICE}.id = ${Entities.PAYMENT}.payment_invoice_id`)
                .leftJoin(OrderEntity, `${Entities.ORDER}`, `${Entities.ORDER}.id = ${Entities.INVOICE}.invoice_order_id`)
                .leftJoin(CustomerEntity, `${Entities.CUSTOMER}`, `${Entities.CUSTOMER}.id = ${Entities.ORDER}.customer_id`)
                .leftJoin(UserEntity, `${Entities.USER}`, `${Entities.USER}.id = ${Entities.CUSTOMER}.user_id`)
                .where(`payment_invoice_id = '${payload[0].payment_invoice_id}'`);

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);

                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        let filter0 = f[0];
                        let filter1 = f[1];
                        query = query.andWhere(`UPPER(${filter0}.${filter1}) Like '%${v.value.toUpperCase()}%' `);
                    } else {
                        let from = Entities.PAYMENT;
                        if (v.id === 'si_number') from = Entities.ORDER;
                        else if (v.id === 'name') from = Entities.USER;

                        query = query.andWhere(`UPPER(${from}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
                    }
                });
            }

            const count = await query.getCount();

            query
                .offset(pagination.skip)
                .limit(pagination.take)
                .orderBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'ASC');

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
            console.log('Error Dao: Query for getPaymentDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const createPayment = async (payload: PaymentDaoCreateInterface) => {
        try {
            let o_id = '';

            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    //INSERT

                    // console.log('----------------------------');
                    // console.log(payload);
                    // console.log('----------------------------');

                    await transactionEntityManager
                        .getRepository(PaymentEntity)
                        .createQueryBuilder(Entities.PAYMENT)
                        .update(PaymentEntity)
                        .set({
                            recent: 'N'
                        })
                        .where('payment_invoice_id = :id', { id: payload.payment_invoice_id })
                        .execute();

                    const data: InsertResult = await transactionEntityManager.getRepository(PaymentEntity).createQueryBuilder(Entities.PAYMENT).insert().into(PaymentEntity).values(payload).execute();
                    let { id } = data.identifiers[0];

                    o_id = id;

                    // const totalPayment: any = await getManager()
                    //     .createQueryBuilder()
                    //     .select('payment_invoice_id', 'payment_invoice_id')
                    //     .addSelect('SUM(over_payment)', 'over_payment')
                    //     .from(useSchemaAndTableName(Entities.PAYMENT), Entities.PAYMENT)
                    //     .where(`payment_invoice_id = :id`, { id: payload.payment_invoice_id })
                    //     .groupBy('payment_invoice_id')
                    //     .execute();

                    // let top = totalPayment.length > 0 ? totalPayment[0].over_payment : 0;
                    // let o = parseFloat(top) + Math.abs(payload.over_payment);

                    // if (parseFloat(payload.account_balance.toString()) === 0) {
                    //     await transactionEntityManager
                    //         .getRepository(CustomerEntity)
                    //         .createQueryBuilder(Entities.CUSTOMER)
                    //         .update(CustomerEntity)
                    //         .set({
                    //             customer_over_payment: payload.over_payment,
                    //             customer_balance: 0
                    //         })
                    //         .where('id = :id', { id: payload.payment_invoice_id })
                    //         .execute();
                    // } else {
                    await transactionEntityManager
                        .getRepository(CustomerEntity)
                        .createQueryBuilder(Entities.CUSTOMER)
                        .update(CustomerEntity)
                        .set({
                            customer_balance: payload.account_balance,
                            customer_over_payment: payload.over_payment,
                            customer_payment_status: payload.customer_payment_status,
                            customer_status: payload.customer_payment_status
                        })
                        .where('id = :id', { id: payload.customer_id })
                        .execute();
                    //}

                    //if (payload.payment_status === 'Paid') {
                    await transactionEntityManager
                        .getRepository(OrderEntity)
                        .createQueryBuilder(Entities.ORDER)
                        .update(OrderEntity)
                        .set({
                            order_status: payload.order_status,
                            payment_status: payload.payment_status
                        })
                        .where(`id = :id`, { id: payload.order_id })
                        .execute();
                    //}

                    return true;
                } catch (err) {
                    console.log('Error Dao: Create Payment Dao Transaction -> ', err);
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Created], o_id, message: 'Successfully created.' };
            } else {
                console.log('Error Dao: Create Payment Transaction -> ', 'Error Creating Payment!');
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: 'Error Creating Payment!'
                };
            }

            // if (payload.payment_ewt === 'Y') {
            //     payment.payment_ewt_percentage = payload.payment_ewt_percentage;
            //     payment.payment_ewt_amount = payload.payment_ewt_amount;
            //     payment.payment_ewt_due_date = payload.payment_ewt_due_date;
            //     payment.personnel_id_ewt = payload.personnel_id_ewt;

            //     const ewt = new EWTEntity();
            //     ewt.ewt_reference_number = generateReferenceNumber();
            //     ewt.ewt_amount = payload.payment_ewt_amount;
            //     ewt.ewt_due_date = payload.payment_ewt_due_date;
            //     ewt.payment_ewt_percentage = payload.payment_ewt_percentage;
            //     ewt.ewt_personnel_id = payload.personnel_id_ewt;
            //     ewt.created_by = payload.created_by;

            //     payment.ewt = ewt;
            // }

            //const query = getRepository(PaymentEntity);

            //await userRepository.save(payment);

            //const query = getRepository(PaymentEntity).createQueryBuilder(Entities.PAYMENT).insert().into(PaymentEntity).values(payload);
            //const data: InsertResult = await query.save();
            // const data = await query.save(PaymentEntity);
            //const { id } = data.identifiers[0];
            //console.log(data);
            //return { ...HTTP_RESPONSES[HttpResponseType.Created], message: 'Successfully created.' };
        } catch (err) {
            console.log('Error Dao: Create Payment Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const updatePayment = async (id: string, payload: PaymentDaoUpdateInterface) => {
        try {
            console.log('----------payment-------controller-=-----------');
            console.log(id);
            console.log(payload);
            console.log('----------payment-------controller-=-----------');

            //const query = getRepository(PaymentEntity).createQueryBuilder(Entities.PAYMENT).update(PaymentEntity).set(payload).where('id = :id', { id });
            //await query.execute();

            //check if payment had been ewt
            //throw new Error('TEST');

            // if (payload.payment_ewt === 'Y') {
            //     payment.payment_ewt_percentage = payload.payment_ewt_percentage;
            //     payment.payment_ewt_amount = payload.payment_ewt_amount;
            //     payment.payment_ewt_due_date = payload.payment_ewt_due_date;
            //     payment.personnel_id_ewt = payload.personnel_id_ewt;

            //     const ewt = new EWTEntity();
            //     ewt.ewt_reference_number = generateReferenceNumber();
            //     ewt.ewt_amount = payload.payment_ewt_amount;
            //     ewt.ewt_due_date = payload.payment_ewt_due_date;
            //     ewt.payment_ewt_percentage = payload.payment_ewt_percentage;
            //     ewt.ewt_personnel_id = payload.personnel_id_ewt;

            //     payment.ewt = ewt;
            // }

            // const query = getRepository(PaymentEntity);

            return { ...HTTP_RESPONSES[HttpResponseType.Updated], message: 'Successfully updated.' };
        } catch (err) {
            console.log('Error Dao: update Payment -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const deletePayment = async (id: string, _payload: PaymentDaoDeleteInterface) => {
        try {
            //const UserRepository = getRepository(PaymentEntity);

            //const results = await UserRepository.findOne({ id });

            //await getRepository(PaymentEntity).createQueryBuilder(Entities.PAYMENT).update(PaymentEntity).set(payload).where('id = :id', { id }).execute();

            const transaction = await getManager().transaction(async (_transactionEntityManager) => {
                try {
                    let i = id.split('|');

                    console.log('----------------------------');
                    console.log(id);
                    console.log(i);
                    console.log('----------------------------');
                    //const _PAYMNETID: any = await transactionEntityManager.getRepository(PaymentEntity).createQueryBuilder(Entities.PAYMENT).where('id = :id', { id: i[0] }).getOne();
                    //INSERT

                    // await transactionEntityManager
                    //     .getRepository(PaymentEntity)
                    //     .createQueryBuilder(Entities.PAYMENT)
                    //     .update(PaymentEntity)
                    //     .set({
                    //         recent: 'N'
                    //     })
                    //     .where('payment_invoice_id = :id', { id: payload.payment_invoice_id })
                    //     .execute();

                    // await transactionEntityManager.getRepository(PaymentEntity).delete({ id });

                    return true;
                } catch (err) {
                    console.log('Error Dao: Create Payment Dao Transaction -> ', err);
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Deleted], message: 'Successfully deleted.' };
            } else {
                console.log('Error Dao: Delete Payment Transaction -> ', 'Error Delete Payment!');
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: 'Error Delete Payment!'
                };
            }
        } catch (err) {
            console.log('Error Dao: delete Payment -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const deletePaymentHistory = async (id: string, _payload: PaymentDaoDeleteInterface) => {
        try {
            //const UserRepository = getRepository(PaymentEntity);

            //const results = await UserRepository.findOne({ id });

            //await getRepository(PaymentEntity).createQueryBuilder(Entities.PAYMENT).update(PaymentEntity).set(payload).where('id = :id', { id }).execute();
            //await getRepository(PaymentEntity).delete({ id });
            //return { ...HTTP_RESPONSES[HttpResponseType.Deleted], message: 'Successfully deleted.' };

            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    let i = id.split('|');

                    // const PAYMNETID: any = await transactionEntityManager.getRepository(PaymentEntity)
                    // .createQueryBuilder(Entities.PAYMENT).where('id = :id', { id: i[0] })
                    // .limit(1)
                    // .getOne();

                    const nextRecentPayment = await transactionEntityManager
                        .getRepository(PaymentEntity)
                        .createQueryBuilder(Entities.PAYMENT)
                        .leftJoinAndMapOne(`${Entities.PAYMENT}.payment_invoice`, InvoiceEntity, `${Entities.INVOICE}`, `${Entities.INVOICE}.id = ${Entities.PAYMENT}.payment_invoice_id`)
                        .leftJoinAndMapOne(`${Entities.INVOICE}.invoice_order`, OrderEntity, `${Entities.ORDER}`, `${Entities.ORDER}.id = ${Entities.INVOICE}.invoice_order_id`)
                        .leftJoinAndMapOne(`${Entities.ORDER}.order_customer`, CustomerEntity, `${Entities.CUSTOMER}`, `${Entities.CUSTOMER}.id = ${Entities.ORDER}.customer_id`)
                        .where('payment_invoice_id = :id', { id: i[1] })
                        .limit(1)
                        .offset(1)
                        .orderBy('payment_date', 'DESC')
                        .getOne();

                    if (nextRecentPayment && nextRecentPayment !== undefined) {
                        let order_id = nextRecentPayment?.payment_invoice.invoice_order.id;
                        let customer_id = nextRecentPayment?.payment_invoice.invoice_order.order_customer.id;

                        await transactionEntityManager
                            .getRepository(OrderEntity)
                            .createQueryBuilder(Entities.ORDER)
                            .update(OrderEntity)
                            .set({
                                order_status: 'Partial Payment'
                            })
                            .where('id = :id', { id: order_id })
                            .execute();

                        await transactionEntityManager
                            .getRepository(CustomerEntity)
                            .createQueryBuilder(Entities.CUSTOMER)
                            .update(CustomerEntity)
                            .set({
                                customer_balance: nextRecentPayment.account_balance,
                                customer_over_payment: 0,
                                customer_status: 'Partial Payment'
                            })
                            .where('id = :id', { id: customer_id })
                            .execute();

                        await transactionEntityManager
                            .getRepository(PaymentEntity)
                            .createQueryBuilder(Entities.PAYMENT)
                            .update(PaymentEntity)
                            .set({
                                recent: 'Y'
                            })
                            .where('id = :id', { id: nextRecentPayment.id })
                            .execute();

                        await transactionEntityManager.getRepository(PaymentEntity).delete({ id: i[0] });
                    } else {
                        const currentPayment = await transactionEntityManager
                            .getRepository(PaymentEntity)
                            .createQueryBuilder(Entities.PAYMENT)
                            .leftJoinAndMapOne(`${Entities.PAYMENT}.payment_invoice`, InvoiceEntity, `${Entities.INVOICE}`, `${Entities.INVOICE}.id = ${Entities.PAYMENT}.payment_invoice_id`)
                            .leftJoinAndMapOne(`${Entities.INVOICE}.invoice_order`, OrderEntity, `${Entities.ORDER}`, `${Entities.ORDER}.id = ${Entities.INVOICE}.invoice_order_id`)
                            .leftJoinAndMapOne(`${Entities.ORDER}.order_customer`, CustomerEntity, `${Entities.CUSTOMER}`, `${Entities.CUSTOMER}.id = ${Entities.ORDER}.customer_id`)
                            .where(`${Entities.PAYMENT}.id = :id`, { id: i[0] })
                            .getOne();

                        let order_id = currentPayment?.payment_invoice.invoice_order.id;
                        let customer_id = currentPayment?.payment_invoice.invoice_order.order_customer.id;

                        await transactionEntityManager
                            .getRepository(OrderEntity)
                            .createQueryBuilder(Entities.ORDER)
                            .update(OrderEntity)
                            .set({
                                order_status: 'For Payment'
                            })
                            .where('id = :id', { id: order_id })
                            .execute();

                        await transactionEntityManager
                            .getRepository(CustomerEntity)
                            .createQueryBuilder(Entities.CUSTOMER)
                            .update(CustomerEntity)
                            .set({
                                customer_balance: currentPayment?.payment_balance,
                                customer_over_payment: currentPayment?.previous_over_payment,
                                customer_status: 'Pending Payment'
                            })
                            .where('id = :id', { id: customer_id })
                            .execute();

                        await transactionEntityManager.getRepository(PaymentEntity).delete({ id: i[0] });
                    }

                    //console.log('----------------------------');

                    //console.log(nextRecentPayment);
                    //console.log('----------------------------');
                    //INSERT

                    // await transactionEntityManager
                    //     .getRepository(PaymentEntity)
                    //     .createQueryBuilder(Entities.PAYMENT)
                    //     .update(PaymentEntity)
                    //     .set({
                    //         recent: 'N'
                    //     })
                    //     .where('payment_invoice_id = :id', { id: payload.payment_invoice_id })
                    //     .execute();

                    // await transactionEntityManager.getRepository(PaymentEntity).delete({ id });

                    return true;
                } catch (err) {
                    console.log('Error Dao: Create Payment Dao Transaction -> ', err);
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Deleted], message: 'Successfully deleted.' };
            } else {
                console.log('Error Dao: Delete Payment Transaction -> ', 'Error Delete Payment!');
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: 'Error Delete Payment!'
                };
            }
        } catch (err) {
            console.log('Error Dao: delete Payment -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const restorePayment = async (id: string, payload: PaymentDaoRestoreInterface) => {
        try {
            await getRepository(PaymentEntity)
                .createQueryBuilder(Entities.PAYMENT)
                .update(PaymentEntity)
                .set({ ...payload, updated_at: new Date() })
                .where('id = :id', { id })
                .execute();
            await getRepository(PaymentEntity).restore({ id });
            return { ...HTTP_RESPONSES[HttpResponseType.Restored], message: 'Successfully restored.' };
        } catch (err) {
            console.log('Error Dao: restorePayment -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

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

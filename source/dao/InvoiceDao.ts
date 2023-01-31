import { InvoiceDaoCreateInterface, InvoiceDaoDeleteInterface, InvoiceDaoRestoreInterface, InvoiceDaoUpdateInterface } from 'source/interfaces/dao/InvoiceDaoInterface';
import { InvoicePendingDaoCreateInterface, InvoicePendingDaoDeleteInterface, InvoicePendingDaoUpdateInterface } from 'source/interfaces/dao/InvoicePendingDaoInterface';
import { getManager, getRepository, InsertResult } from 'typeorm';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { InvoiceEntity } from '../entities/InvoiceEntities';
import { PaginationDaoInterface } from '../interfaces/dao/PaginationDaoInterface';
import { Entities } from './../constant/Entities';
import { CustomerEntity } from './../entities/CustomerEntities';
import { InvoicePendingEntity } from './../entities/InvoicePendingEntities';
import { OrderEntity } from './../entities/OrderEntities';
import { RoleEntity } from './../entities/RoleEntities';
import { UserEntity } from './../entities/UserEntities';
import { InvoicePendingDaoApprovalInterface } from './../interfaces/dao/InvoicePendingDaoInterface';
import { HeadersRouteInterface } from './../interfaces/routes/HttpRoutesInterface';
import { useSchemaAndTableName } from './../util/Schema';

export const useInvoiceDao = () => {
    const getAllInvoice = async (_payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            if (!defaultSort.includes('.')) {
                defaultSort = Entities.INVOICE + '.' + defaultSort;
            }

            let query = getRepository(InvoiceEntity).createQueryBuilder(Entities.INVOICE);

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);
                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like :q`, { q: `%${v.value.toUpperCase()}%` });
                    } else {
                        query = query.andWhere(`UPPER(${Entities.INVOICE}.${v.id}) Like :q`, { q: `%${v.value.toUpperCase()}%` });
                    }
                });
            }

            const count = await query.getCount();

            query.orderBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC');

            const results = await query.getMany();

            //const results = await UserEntity.find(queries);
            const total = count; //await UserEntity.count(queries);

            let pageCount = Math.ceil(total / pagination.take) || 1;

            return {
                ...HTTP_RESPONSES[HttpResponseType.Success],
                message: 'Successfully Retrieved data.',
                results,
                pagination: { total, current: pagination.current, pageCount }
            };
        } catch (err) {
            console.log('Error Dao: Query for getInvoiceDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const getInvoice = async (payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = 'created_at';
            let where = '';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            if (!defaultSort.includes('.')) {
                if (defaultSort === 'si_number') {
                    defaultSort = Entities.ORDER + '.' + defaultSort;
                } else if (defaultSort === 'name') {
                    defaultSort = Entities.USER + '.' + defaultSort;
                } else {
                    defaultSort = Entities.INVOICE + '.' + defaultSort;
                }
            }

            if (payload.length > 0) {
                if (payload[0].order_status !== undefined) {
                    where = `${Entities.ORDER}.order_status like '${payload[0].order_status._value}'`;
                } else where = `invoice_code = '${payload[0].invoice_code}'`;
            }

            // const totalQuantity: any = getManager()
            //     .createQueryBuilder()
            //     .select('"InvoiceId"', 'InvoiceId')
            //     .addSelect('SUM(quantity)', 'ordered_quantity')
            //     .from(useSchemaAndTableName(Entities.ORDER_Invoice), Entities.ORDER_Invoice)
            //     .groupBy('"InvoiceId"');

            let query: any = getManager()
                .createQueryBuilder()
                .select(`${Entities.INVOICE}.id`, 'id')
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
                .addSelect(`${Entities.INVOICE}.amount_to_pay`, 'amount_to_pay')
                .addSelect(`${Entities.INVOICE}.over_payment`, 'over_payment')
                .addSelect(`${Entities.INVOICE}.approval_ind`, 'approval_ind')
                .addSelect(`${Entities.INVOICE}.reference_value`, 'reference_value')
                .addSelect(`${Entities.ORDER}.id`, 'invoice_order_id')
                .addSelect(`${Entities.ORDER}.si_number`, 'si_number')
                .addSelect(`${Entities.ORDER}.order_status`, 'order_status')
                .addSelect(`${Entities.USER}.name`, 'name')
                .addSelect(`${Entities.USER}.contact_number`, 'contact_number')
                .addSelect(`${Entities.USER}.address`, 'address')
                .addSelect(`${Entities.ROLES}.role_description`, 'role')
                .addSelect(`${Entities.CUSTOMER}.customer_over_payment`, 'customer_over_payment')
                .addSelect(`${Entities.CUSTOMER}.customer_balance`, 'customer_balance')
                .addSelect(`${Entities.CUSTOMER}.id`, 'customer_id')
                .from(useSchemaAndTableName(Entities.INVOICE), Entities.INVOICE)
                .leftJoin(OrderEntity, `${Entities.ORDER}`, `${Entities.ORDER}.id = ${Entities.INVOICE}.invoice_order_id`)
                .leftJoin(CustomerEntity, `${Entities.CUSTOMER}`, `${Entities.CUSTOMER}.id = ${Entities.ORDER}.customer_id`)
                .leftJoin(UserEntity, `${Entities.USER}`, `${Entities.USER}.id = ${Entities.CUSTOMER}.user_id`)
                .leftJoin(RoleEntity, `${Entities.ROLES}`, `${Entities.ROLES}.id = ${Entities.USER}.role_id`)
                .where(where);
            // let query = getRepository(InvoiceEntity)
            //     .createQueryBuilder(Entities.Invoice)
            //     .leftJoinAndSelect('(' + totalQuantity.getQuery() + ')', 'order_Invoice', `order_Invoice."InvoiceId" = ${Entities.Invoice}.id`);

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);

                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like '%${v.value.toUpperCase()}%' `);
                    } else {
                        query = query.andWhere(`UPPER(${Entities.INVOICE}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
                    }
                });
            }
            const count = await query.getCount();

            query
                .offset(pagination.skip)
                .limit(pagination.take)
                .orderBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC');

            const results = await query.getRawMany();

            //const results = await UserEntity.find(queries);
            const total = count; //await UserEntity.count(queries);

            let pageCount = Math.ceil(total / pagination.take) || 1;

            return {
                ...HTTP_RESPONSES[HttpResponseType.Success],
                message: 'Successfully Retrieved data.',
                results,
                pagination: { total, current: pagination.current, pageCount }
            };
        } catch (err) {
            console.log('Error Dao: Query for getInvoiceDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const createInvoice = async (payload: InvoiceDaoCreateInterface) => {
        try {
            let Invoice_id: any;
            const userExist = await getRepository(InvoiceEntity).createQueryBuilder(Entities.INVOICE).where(`UPPER(Invoice_name) = UPPER('${payload.invoice_code}')`).getMany();

            if (userExist.length > 0) {
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `User ${payload.invoice_code.toUpperCase()} already exist!`
                };
            }

            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    //INSERT
                    const data: InsertResult = await transactionEntityManager.getRepository(InvoiceEntity).createQueryBuilder(Entities.INVOICE).insert().into(InvoiceEntity).values(payload).execute();

                    let { id } = data.identifiers[0];

                    Invoice_id = id;

                    return true;
                } catch (err) {
                    console.log('Error Dao: Deleting ewt Dao Transaction -> ', err);
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Created], Invoice_id, message: 'Successfully created.' };
            } else {
                console.log('Error Dao: Create Invoice Transaction -> ', 'Error Creating Invoice!');
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: 'Error Creating Invoice!'
                };
            }
        } catch (err) {
            console.log('Error Dao: Create Invoice Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const updateInvoice = async (id: string, payload: InvoiceDaoUpdateInterface) => {
        try {
            const query = getRepository(InvoiceEntity).createQueryBuilder(Entities.INVOICE).update(InvoiceEntity).set(payload).where('id = :id', { id });
            await query.execute();
            return { ...HTTP_RESPONSES[HttpResponseType.Updated], message: 'Successfully updated.' };
        } catch (err) {
            console.log('Error Dao: update Invoice -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const deleteInvoice = async (id: string, payload: InvoiceDaoDeleteInterface) => {
        try {
            await getRepository(InvoiceEntity).createQueryBuilder(Entities.INVOICE).update(InvoiceEntity).set(payload).where('id = :id', { id }).execute();
            await getRepository(InvoiceEntity).delete({ id });
            return { ...HTTP_RESPONSES[HttpResponseType.Deleted], message: 'Successfully deleted.' };
        } catch (err) {
            console.log('Error Dao: delete Invoice -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const getInvoicePending = async (payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = 'request_date';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            if (!defaultSort.includes('.')) {
                if (defaultSort === 'si_number') {
                    defaultSort = Entities.ORDER + '.' + defaultSort;
                } else if (defaultSort === 'name') {
                    defaultSort = Entities.USER + '.' + defaultSort;
                } else {
                    defaultSort = Entities.INVOICE_PENDING + '.' + defaultSort;
                }
            }

            let where = '';

            if (payload.length > 0) {
                let date_from = payload[0];
                let date_to = payload[1];

                if (date_from !== undefined && date_to !== undefined) {
                    where = `DATE(${Entities.INVOICE_PENDING}.invoice_date) BETWEEN DATE('${date_from.df._value}') AND DATE('${date_to.dt._value}')`;
                }
            }

            let query: any = getManager()
                .createQueryBuilder()
                .select(`${Entities.INVOICE_PENDING}.id`, 'id')
                .addSelect(`${Entities.INVOICE_PENDING}.invoice_code`, 'invoice_code')
                .addSelect(`TO_CHAR(${Entities.INVOICE_PENDING}.invoice_date, 'MM/DD/YYYY')`, 'invoice_date')
                .addSelect(`${Entities.INVOICE_PENDING}.discount`, 'discount')
                .addSelect(`${Entities.INVOICE_PENDING}.total_order`, 'total_order')
                .addSelect(`${Entities.INVOICE}.total_order`, 'original_total_order')
                .addSelect(`${Entities.INVOICE_PENDING}.request_by`, 'request_by')
                .addSelect(`TO_CHAR(${Entities.INVOICE_PENDING}.request_date, 'MM/DD/YYYY')`, 'request_date')
                .addSelect(`${Entities.INVOICE_PENDING}.event_request`, 'event_request')
                .addSelect(`${Entities.INVOICE_PENDING}.down_payment`, 'down_payment')
                .addSelect(`${Entities.INVOICE_PENDING}.delivery_fee`, 'delivery_fee')
                .addSelect(`${Entities.INVOICE_PENDING}.shipping_details`, 'shipping_details')
                .addSelect(`${Entities.INVOICE_PENDING}.carrier`, 'carrier')
                .addSelect(`${Entities.INVOICE_PENDING}.special_note`, 'special_note')
                .addSelect(`${Entities.INVOICE_PENDING}.est_weight`, 'est_weight')
                .addSelect(`${Entities.INVOICE_PENDING}.amount_to_pay`, 'amount_to_pay')
                .addSelect(`${Entities.INVOICE_PENDING}.over_payment`, 'over_payment')
                .addSelect(`${Entities.INVOICE_PENDING}.approval_ind`, 'approval_ind')
                .addSelect(`${Entities.INVOICE_PENDING}.reference_value`, 'reference_value')
                .addSelect(`${Entities.INVOICE_PENDING}.invoice_order_id`, 'invoice_order_id')
                .addSelect(`${Entities.ORDER}.si_number`, 'si_number')
                .addSelect(`${Entities.USER}.name`, 'name')
                .addSelect(`${Entities.USER}.contact_number`, 'contact_number')
                .addSelect(`${Entities.USER}.address`, 'address')
                .addSelect(`${Entities.ROLES}.role_description`, 'role')
                .from(useSchemaAndTableName(Entities.INVOICE_PENDING), Entities.INVOICE_PENDING)
                .leftJoin(OrderEntity, `${Entities.ORDER}`, `${Entities.ORDER}.id = ${Entities.INVOICE_PENDING}.invoice_order_id`)
                .leftJoin(InvoiceEntity, `${Entities.INVOICE}`, `${Entities.INVOICE}.reference_value = ${Entities.INVOICE_PENDING}.reference_value`)
                .leftJoin(CustomerEntity, `${Entities.CUSTOMER}`, `${Entities.CUSTOMER}.id = ${Entities.ORDER}.customer_id`)
                .leftJoin(UserEntity, `${Entities.USER}`, `${Entities.USER}.id = ${Entities.CUSTOMER}.user_id`)
                .leftJoin(RoleEntity, `${Entities.ROLES}`, `${Entities.ROLES}.id = ${Entities.USER}.role_id`)
                .where(where);

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);

                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like '%${v.value.toUpperCase()}%' `);
                    } else {
                        query = query.andWhere(`UPPER(${v.id}) Like '%${v.value.toUpperCase()}%' `);
                    }
                });
            }
            const count = await query.getCount();

            query
                .offset(pagination.skip)
                .limit(pagination.take)
                .orderBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC');

            const results = await query.getRawMany();

            //const results = await UserEntity.find(queries);
            const total = count; //await UserEntity.count(queries);

            let pageCount = Math.ceil(total / pagination.take) || 1;

            return {
                ...HTTP_RESPONSES[HttpResponseType.Success],
                message: 'Successfully Retrieved data.',
                results,
                pagination: { total, current: pagination.current, pageCount }
            };
        } catch (err) {
            console.log('Error Dao: Query for getInvoiceDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const createInvoicePending = async (payload: InvoicePendingDaoCreateInterface) => {
        try {
            const InvoicePendingExist = await getRepository(InvoicePendingEntity).createQueryBuilder(Entities.INVOICE_PENDING).where(`invoice_order_id = '${payload.invoice_order_id}'`).getMany();

            const InvoiceExist = await getRepository(InvoiceEntity).createQueryBuilder(Entities.INVOICE).where(`invoice_order_id = '${payload.invoice_order_id}'`).getMany();
            if (InvoiceExist.length > 0 || InvoicePendingExist.length > 0) {
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `SI ${payload.si_number.toUpperCase()} is already pending for approval!`
                };
            }

            let i_id: any;

            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    const data: InsertResult = await transactionEntityManager
                        .getRepository(InvoicePendingEntity)
                        .createQueryBuilder(Entities.INVOICE_PENDING)
                        .insert()
                        .into(InvoicePendingEntity)
                        .values(payload)
                        .execute();

                    let { id } = data.identifiers[0];
                    i_id = id;

                    await transactionEntityManager
                        .getRepository(OrderEntity)
                        .createQueryBuilder(Entities.ORDER)
                        .update(OrderEntity)
                        .set({
                            order_status: 'Invoice is Pending for Approval'
                        })
                        .where('id = :id', { id: payload.invoice_order_id })
                        .execute();

                    return true;
                } catch (err) {
                    console.log('Error Dao: Create Invoice Dao Transaction -> ', err);
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Created], i_id, message: 'Successfully submitted for approval.' };
            } else {
                console.log('Error Dao: Create Invoice Transaction -> ', 'Error Creating Invoice Transaction!');
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: 'Error Creating Invoice!'
                };
            }
        } catch (err) {
            console.log('Error Dao: Create Invoice Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const updateInvoicePending = async (_id: string, payload: InvoicePendingDaoUpdateInterface) => {
        try {
            const InvoicePendingExist = await getRepository(InvoicePendingEntity)
                .createQueryBuilder(Entities.INVOICE_PENDING)
                .where(`UPPER(invoice_code) = UPPER('${payload.invoice_code}')`)
                .getMany();
            if (InvoicePendingExist.length > 0) {
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `Invoice ${payload.invoice_code.toUpperCase()} is already pending for approval!`
                };
            }

            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    //INSERT
                    await transactionEntityManager
                        .getRepository(InvoiceEntity)
                        .createQueryBuilder(Entities.INVOICE)
                        .update(InvoiceEntity)
                        .set({ approval_ind: 'Y' })
                        .where('reference_value = :reference_value', { reference_value: payload.reference_value })
                        .execute();

                    await transactionEntityManager.getRepository(InvoicePendingEntity).createQueryBuilder(Entities.INVOICE_PENDING).insert().into(InvoicePendingEntity).values(payload).execute();

                    await transactionEntityManager
                        .getRepository(OrderEntity)
                        .createQueryBuilder(Entities.ORDER)
                        .update(OrderEntity)
                        .set({
                            order_status: 'Invoice is Pending for Approval'
                        })
                        .where('id = :id', { id: payload.invoice_order_id })
                        .execute();

                    return true;
                } catch (err) {
                    console.log('Error in ${payload.status} Invoice Pending Dao Transaction -> ', err);
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Updated], message: 'Successfully submitted for approval.' };
            } else {
                console.log('Error Dao: Rejecting Invoice Pending Transaction -> ', `Error in Invoice Pending!`);
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `Error in Invoice Pending!`
                };
            }

            //const query = getRepository(InvoiceEntity).createQueryBuilder(Entities.Invoice).update(InvoiceEntity).set(payload).where('id = :id', { id });
            //await query.execute();
            //INSERT
        } catch (err) {
            console.log('Error Dao: Update Invoice Pending -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const deleteInvoicePending = async (id: string, payload: InvoicePendingDaoDeleteInterface) => {
        // await getRepository(InvoiceEntity).createQueryBuilder(Entities.Invoice).update(InvoiceEntity).set(payload).where('id = :id', { id }).execute();
        //await getRepository(InvoiceEntity).delete({ id });

        try {
            const invoicePendingExist = await getRepository(InvoicePendingEntity).createQueryBuilder(Entities.INVOICE_PENDING).where(`UPPER(reference_value) = UPPER('${id}')`).getMany();

            if (invoicePendingExist.length > 0) {
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `Invoice ${invoicePendingExist[0].invoice_code.toUpperCase()} is already pending for approval!`
                };
            }

            //const InvoiceMain = await getRepository(InvoiceEntity).createQueryBuilder(Entities.INVOICE).where(`UPPER(reference_value) = UPPER('${id}')`).getOne();
            const invoiceMain = await getRepository(InvoiceEntity).createQueryBuilder(Entities.INVOICE).where(`UPPER(reference_value) = UPPER('${id}')`).getOne();

            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    //INSERT
                    await transactionEntityManager
                        .getRepository(InvoiceEntity)
                        .createQueryBuilder(Entities.INVOICE)
                        .update(InvoiceEntity)
                        .set({ approval_ind: 'Y' })
                        .where('reference_value = :reference_value', { reference_value: id })
                        .execute();

                    await transactionEntityManager
                        .getRepository(OrderEntity)
                        .createQueryBuilder(Entities.ORDER)
                        .update(OrderEntity)
                        .set({
                            order_status: 'Invoice is Pending for Approval'
                        })
                        .where('id = :id', { id: invoiceMain?.invoice_order_id })
                        .execute();

                    await transactionEntityManager
                        .getRepository(InvoicePendingEntity)
                        .createQueryBuilder(Entities.INVOICE_PENDING)
                        .insert()
                        .into(InvoicePendingEntity)
                        .values({
                            invoice_code: invoiceMain?.invoice_code,
                            invoice_date: invoiceMain?.invoice_date,
                            discount: invoiceMain?.discount,
                            total_order: invoiceMain?.total_order,
                            amount_to_pay: invoiceMain?.amount_to_pay,
                            over_payment: invoiceMain?.over_payment,
                            approval_ind: 'N',
                            reference_value: id,
                            invoice_order_id: invoiceMain?.invoice_order_id,
                            est_weight: invoiceMain?.est_weight,
                            special_note: invoiceMain?.special_note,
                            shipping_details: invoiceMain?.shipping_details,
                            transportation: invoiceMain?.transportation,
                            carrier: invoiceMain?.carrier,
                            delivery_fee: invoiceMain?.delivery_fee,
                            down_payment: invoiceMain?.down_payment,
                            request_by: payload.request_by,
                            event_request: payload.event_request,
                            request_date: payload.request_date
                        })
                        .execute();

                    return true;
                } catch (err) {
                    console.log('Error Invoice Pending Dao Transaction -> ', err);
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Deleted], message: 'Successfully submitted for approval.' };
            } else {
                console.log('Error Dao: Rejecting Invoice Pending Transaction -> ', `Error in Invoice Pending!`);
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `Error in Invoice Pending!`
                };
            }
        } catch (err) {
            console.log('Error Dao: delete Invoice -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const approvalInvoicePending = async (id: string, payload: InvoicePendingDaoApprovalInterface) => {
        try {
            // await getRepository(InvoiceEntity).createQueryBuilder(Entities.Invoice).update(InvoiceEntity).set(payload).where('id = :id', { id }).execute();

            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    if (payload.status === 'Rejected') {
                        if (payload.event_request === 'Modify' || payload.event_request === 'Delete') {
                            await transactionEntityManager
                                .getRepository(InvoiceEntity)
                                .createQueryBuilder(Entities.INVOICE)
                                .update(InvoiceEntity)
                                .set({
                                    approval_ind: 'N'
                                })
                                .where('reference_value = :reference_value', { reference_value: payload.reference_value })
                                .execute();

                            await transactionEntityManager
                                .getRepository(OrderEntity)
                                .createQueryBuilder(Entities.ORDER)
                                .update(OrderEntity)
                                .set({
                                    order_status: 'For Payment'
                                })
                                .where('id = :id', { id: payload.invoice_order_id })
                                .execute();
                        } else {
                            await transactionEntityManager
                                .getRepository(OrderEntity)
                                .createQueryBuilder(Entities.ORDER)
                                .update(OrderEntity)
                                .set({
                                    order_status: 'For Invoice'
                                })
                                .where('id = :id', { id: payload.invoice_order_id })
                                .execute();
                        }
                    } else {
                        const CustomerID: any = await transactionEntityManager
                            .getRepository(OrderEntity)
                            .createQueryBuilder(Entities.ORDER)
                            .where('id = :id', { id: payload.invoice_order_id })
                            .getOne();

                        if (payload.event_request === 'Add') {
                            const InvoicePending: any = await transactionEntityManager
                                .getRepository(InvoicePendingEntity)
                                .createQueryBuilder(Entities.INVOICE_PENDING)
                                .where('id = :id', { id })
                                .getOne();

                            let data: InvoiceDaoCreateInterface = {
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

                            await transactionEntityManager.getRepository(InvoiceEntity).createQueryBuilder(Entities.INVOICE).insert().into(InvoiceEntity).values(data).execute();

                            await transactionEntityManager
                                .getRepository(OrderEntity)
                                .createQueryBuilder(Entities.ORDER)
                                .update(OrderEntity)
                                .set({
                                    order_status: 'For Payment'
                                })
                                .where('id = :id', { id: payload.invoice_order_id })
                                .execute();

                            await transactionEntityManager
                                .getRepository(CustomerEntity)
                                .createQueryBuilder(Entities.CUSTOMER)
                                .update(CustomerEntity)
                                .set({
                                    customer_balance: InvoicePending.total_order,
                                    customer_status: 'Pending Payment'
                                })
                                .where('id = :id', { id: CustomerID.customer_id })
                                .execute();
                        } else if (payload.event_request === 'Modify') {
                            await transactionEntityManager
                                .getRepository(InvoiceEntity)
                                .createQueryBuilder(Entities.INVOICE)
                                .update(InvoiceEntity)
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

                            await transactionEntityManager
                                .getRepository(OrderEntity)
                                .createQueryBuilder(Entities.ORDER)
                                .update(OrderEntity)
                                .set({
                                    order_status: 'For Payment'
                                })
                                .where('id = :id', { id: payload.invoice_order_id })
                                .execute();

                            await transactionEntityManager
                                .getRepository(CustomerEntity)
                                .createQueryBuilder(Entities.CUSTOMER)
                                .update(CustomerEntity)
                                .set({
                                    customer_balance: payload.total_order,
                                    customer_status: 'Pending Payment'
                                })
                                .where('id = :id', { id: CustomerID.customer_id })
                                .execute();
                        } else if (payload.event_request === 'Delete') {
                            await transactionEntityManager
                                .getRepository(OrderEntity)
                                .createQueryBuilder(Entities.ORDER)
                                .update(OrderEntity)
                                .set({
                                    order_status: 'For Invoice'
                                })
                                .where('id = :id', { id: payload.invoice_order_id })
                                .execute();

                            await transactionEntityManager
                                .getRepository(CustomerEntity)
                                .createQueryBuilder(Entities.CUSTOMER)
                                .update(CustomerEntity)
                                .set({
                                    customer_balance: CustomerID.amount_to_pay,
                                    customer_status: 'Pending Invoice'
                                })
                                .where('id = :id', { id: CustomerID.customer_id })
                                .execute();

                            await transactionEntityManager.getRepository(InvoiceEntity).createQueryBuilder(Entities.INVOICE).delete().where({ reference_value: payload.reference_value }).execute();
                        }
                    }
                    await transactionEntityManager.getRepository(InvoicePendingEntity).delete({ id });

                    return true;
                } catch (err) {
                    console.log('Error in ${payload.status} Invoice Pending Dao Transaction -> ', err);
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Approval], message: `Successfully ${payload.status}.` };
            } else {
                console.log('Error Dao: Rejecting Invoice Pending Transaction -> ', `Error in ${payload.status} Invoice Pending!`);
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `Error in ${payload.status} Invoice Pending!`
                };
            }
        } catch (err) {
            console.log('Error Dao: delete Invoice -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const restoreInvoice = async (id: string, payload: InvoiceDaoRestoreInterface) => {
        try {
            await getRepository(InvoiceEntity)
                .createQueryBuilder(Entities.INVOICE)
                .update(InvoiceEntity)
                .set({ ...payload, updated_at: new Date() })
                .where('id = :id', { id })
                .execute();
            await getRepository(InvoiceEntity).restore({ id });
            return { ...HTTP_RESPONSES[HttpResponseType.Restored], message: 'Successfully restored.' };
        } catch (err) {
            console.log('Error Dao: restoreInvoice -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    // const getInvoiceReport = async (request: InvoiceRouteInterface) => {
    //     try {
    //         let df_value = request!.df as string;
    //         let dt_value = request!.dt as string;

    //         let df_date: any = moment(new Date(df_value)).format('DD/MM/yyyy');
    //         let dt_date: any = moment(new Date(dt_value)).add(1, 'day').format('DD/MM/yyyy');

    //         let queries: FindManyOptions<InvoiceEntity> = {
    //             relations: ['personnel_Invoice'],
    //             where: { created_at: Between(df_date, dt_date) },
    //             order: { created_at: 'ASC' }
    //         };

    //         const results = await InvoiceEntity.find(queries);

    //         return {
    //             ...HTTP_RESPONSES[HttpResponseType.Success],
    //             message: 'Successfully Retrieved data.',
    //             results
    //         };
    //     } catch (err) {
    //         console.log('Error Dao: Query for getInvoiceReport Transaction -> ', err);
    //         return {
    //             ...HTTP_RESPONSES[HttpResponseType.BadRequest],
    //             message: err.message
    //         };
    //     }
    // };

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
        //getInvoiceReport
    };
};

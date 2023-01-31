import { ProductDaoCreateInterface, ProductDaoDeleteInterface, ProductDaoRestoreInterface, ProductDaoUpdateInterface } from 'source/interfaces/dao/ProductDaoInterface';
import { ProductPendingDaoCreateInterface, ProductPendingDaoDeleteInterface, ProductPendingDaoUpdateInterface } from 'source/interfaces/dao/ProductPendingDaoInterface';
import { getManager, getRepository, InsertResult } from 'typeorm';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { ProductsEntity } from '../entities/ProductEntities';
import { PaginationDaoInterface } from '../interfaces/dao/PaginationDaoInterface';
import { Entities } from './../constant/Entities';
import { ProductsPendingEntity } from './../entities/ProductPendingEntities';
import { ProductPendingDaoApprovalInterface } from './../interfaces/dao/ProductPendingDaoInterface';
import { HeadersRouteInterface } from './../interfaces/routes/HttpRoutesInterface';
import { useSchemaAndTableName } from './../util/Schema';

export const useProductDao = () => {
    const getAllProduct = async (_payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            if (!defaultSort.includes('.')) {
                defaultSort = Entities.PRODUCTS + '.' + defaultSort;
            }

            let query = getRepository(ProductsEntity).createQueryBuilder(Entities.PRODUCTS);

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);
                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like :q`, { q: `%${v.value.toUpperCase()}%` });
                    } else {
                        query = query.andWhere(`UPPER(${Entities.PRODUCTS}.${v.id}) Like :q`, { q: `%${v.value.toUpperCase()}%` });
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
            console.log('Error Dao: Query for getProductDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const getProduct = async (_payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            if (!defaultSort.includes('.')) {
                // console.log('-------------');
                // console.log(defaultSort);
                // console.log('-------------');
                if (defaultSort === 'delivered_quantity') {
                    defaultSort = 'total_delivered' + '.' + defaultSort;
                } else if (defaultSort === 'remaining_quantity') {
                    defaultSort = defaultSort;
                } else {
                    defaultSort = Entities.PRODUCTS + '.' + defaultSort;
                }
            }

            const totalQuantity: any = getManager()
                .createQueryBuilder()
                .select('"productId"', 'productId')
                .addSelect('SUM(quantity)', 'ordered_quantity')
                .from(useSchemaAndTableName(Entities.ORDER_PRODUCTS), Entities.ORDER_PRODUCTS)
                .groupBy('"productId"');

            const totalDelivered: any = getManager()
                .createQueryBuilder()
                .select('"productId"', 'productId')
                .addSelect('SUM(delivered_quantity)', 'delivered_quantity')
                .from(useSchemaAndTableName(Entities.ORDER_DELIVERED), Entities.ORDER_DELIVERED)
                .groupBy('"productId"');

            let query: any = getManager()
                .createQueryBuilder()
                .select(`${Entities.PRODUCTS}.id`, 'id')
                .addSelect('product_code', 'product_code')
                .addSelect('product_name', 'product_name')
                .addSelect('quantity', 'quantity')
                .addSelect('total_orders.ordered_quantity', 'ordered_quantity')
                .addSelect('total_delivered.delivered_quantity', 'delivered_quantity')
                .addSelect('coalesce(total_orders.ordered_quantity,0) - coalesce(total_delivered.delivered_quantity,0)', 'remaining_quantity')
                .addSelect('(quantity - coalesce(total_orders.ordered_quantity,0)) + coalesce(total_delivered.delivered_quantity,0)', 'forecasted_quantity')
                .addSelect('reference_value', 'reference_value')
                .addSelect('approval_ind', 'approval_ind')
                .from(useSchemaAndTableName(Entities.PRODUCTS), Entities.PRODUCTS)
                .leftJoin('(' + totalQuantity.getQuery() + ')', 'total_orders', `total_orders."productId" = ${Entities.PRODUCTS}.id`)
                .leftJoin('(' + totalDelivered.getQuery() + ')', 'total_delivered', `total_delivered."productId" = ${Entities.PRODUCTS}.id`);
            // let query = getRepository(ProductsEntity)
            //     .createQueryBuilder(Entities.PRODUCTS)
            //     .leftJoinAndSelect('(' + totalQuantity.getQuery() + ')', 'order_products', `order_products."productId" = ${Entities.PRODUCTS}.id`);

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);

                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like '%${v.value.toUpperCase()}%' `);
                    } else {
                        query = query.andWhere(`UPPER(${Entities.PRODUCTS}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
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
            console.log('Error Dao: Query for getProductDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const createProduct = async (payload: ProductDaoCreateInterface) => {
        try {
            let Product_id: any;
            const userExist = await getRepository(ProductsEntity).createQueryBuilder(Entities.PRODUCTS).where(`UPPER(Product_name) = UPPER('${payload.product_name}')`).getMany();

            if (userExist.length > 0) {
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `User ${payload.product_name.toUpperCase()} already exist!`
                };
            }

            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    //INSERT
                    const data: InsertResult = await transactionEntityManager
                        .getRepository(ProductsEntity)
                        .createQueryBuilder(Entities.PRODUCTS)
                        .insert()
                        .into(ProductsEntity)
                        .values(payload)
                        .execute();

                    let { id } = data.identifiers[0];

                    Product_id = id;

                    return true;
                } catch (err) {
                    console.log('Error Dao: Deleting ewt Dao Transaction -> ', err);
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Created], Product_id, message: 'Successfully created.' };
            } else {
                console.log('Error Dao: Create Product Transaction -> ', 'Error Creating Product!');
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: 'Error Creating Product!'
                };
            }
        } catch (err) {
            console.log('Error Dao: Create Product Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const updateProduct = async (id: string, payload: ProductDaoUpdateInterface) => {
        try {
            const query = getRepository(ProductsEntity).createQueryBuilder(Entities.PRODUCTS).update(ProductsEntity).set(payload).where('id = :id', { id });
            await query.execute();
            return { ...HTTP_RESPONSES[HttpResponseType.Updated], message: 'Successfully updated.' };
        } catch (err) {
            console.log('Error Dao: update Product -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const deleteProduct = async (id: string, payload: ProductDaoDeleteInterface) => {
        try {
            await getRepository(ProductsEntity).createQueryBuilder(Entities.PRODUCTS).update(ProductsEntity).set(payload).where('id = :id', { id }).execute();
            await getRepository(ProductsEntity).delete({ id });
            return { ...HTTP_RESPONSES[HttpResponseType.Deleted], message: 'Successfully deleted.' };
        } catch (err) {
            console.log('Error Dao: delete Product -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const getProductPending = async (_payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = 'request_date';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            if (!defaultSort.includes('.')) {
                defaultSort = Entities.PRODUCTS_PENDING + '.' + defaultSort;
            }

            // let query = getRepository(ProductsPendingEntity).createQueryBuilder(Entities.PRODUCTS_PENDING);

            let query: any = getManager()
                .createQueryBuilder()
                .select(`${Entities.PRODUCTS_PENDING}.id`, 'id')
                .addSelect(`${Entities.PRODUCTS_PENDING}.product_code`, 'product_code')
                .addSelect(`${Entities.PRODUCTS_PENDING}.product_name`, 'product_name')
                .addSelect(`${Entities.PRODUCTS}.product_name`, 'original_product_name')
                .addSelect(`${Entities.PRODUCTS_PENDING}.quantity`, 'quantity')
                .addSelect(`${Entities.PRODUCTS}.quantity`, 'original_quantity')
                .addSelect(`${Entities.PRODUCTS_PENDING}.reference_value`, 'reference_value')
                .addSelect(`${Entities.PRODUCTS_PENDING}.forecasted_quantity`, 'forecasted_quantity')
                .addSelect('event_request', 'event_request')
                .addSelect('request_date', 'request_date')
                .addSelect('request_by', 'request_by')
                .from(useSchemaAndTableName(Entities.PRODUCTS_PENDING), Entities.PRODUCTS_PENDING)
                .leftJoin(ProductsEntity, `${Entities.PRODUCTS}`, `${Entities.PRODUCTS}.reference_value = ${Entities.PRODUCTS_PENDING}.reference_value`);

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);

                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like '%${v.value.toUpperCase()}%' `);
                    } else {
                        query = query.andWhere(`UPPER(${Entities.PRODUCTS_PENDING}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
                    }
                });
            }
            const count = await query.getCount();

            query
                .skip(pagination.skip)
                .take(pagination.take)
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
            console.log('Error Dao: Query for getProductDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const createProductPending = async (payload: ProductPendingDaoCreateInterface) => {
        try {
            const productPendingExist = await getRepository(ProductsPendingEntity)
                .createQueryBuilder(Entities.PRODUCTS_PENDING)
                .where(`UPPER(product_code) = UPPER('${payload.product_code.trim()}')`)
                .getMany();

            const productExist = await getRepository(ProductsEntity).createQueryBuilder(Entities.PRODUCTS).where(`UPPER(product_code) = UPPER('${payload.product_code.trim()}')`).getMany();
            if (productExist.length > 0 || productPendingExist.length > 0) {
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `Product ${payload.product_code.toUpperCase()} is already pending for approval!`
                };
            }
            //INSERT
            const data: InsertResult = await getRepository(ProductsPendingEntity).createQueryBuilder(Entities.PRODUCTS_PENDING).insert().into(ProductsPendingEntity).values(payload).execute();

            let { id } = data.identifiers[0];

            return { ...HTTP_RESPONSES[HttpResponseType.Created], id, message: 'Successfully submitted for approval.' };
        } catch (err) {
            console.log('Error Dao: Create Product Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const updateProductPending = async (_id: string, payload: ProductPendingDaoUpdateInterface) => {
        try {
            const productPendingExist = await getRepository(ProductsPendingEntity)
                .createQueryBuilder(Entities.PRODUCTS_PENDING)
                .where(`UPPER(product_code) = UPPER('${payload.product_code}')`)
                .getMany();
            if (productPendingExist.length > 0) {
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `Product ${payload.product_name.toUpperCase()} is already pending for approval!`
                };
            }

            // const productExist = await getRepository(ProductsEntity).createQueryBuilder(Entities.PRODUCTS).where(`UPPER(product_code) = UPPER('${payload.product_code}')`).getMany();
            // if (productExist.length > 0) {
            //     return {
            //         ...HTTP_RESPONSES[HttpResponseType.BadRequest],
            //         message: `Product ${payload.product_code.toUpperCase()} is already exist!`
            //     };
            // }

            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    //INSERT
                    await transactionEntityManager
                        .getRepository(ProductsEntity)
                        .createQueryBuilder(Entities.PRODUCTS)
                        .update(ProductsEntity)
                        .set({ approval_ind: 'Y' })
                        .where('reference_value = :reference_value', { reference_value: payload.reference_value })
                        .execute();

                    await transactionEntityManager.getRepository(ProductsPendingEntity).createQueryBuilder(Entities.PRODUCTS_PENDING).insert().into(ProductsPendingEntity).values(payload).execute();

                    return true;
                } catch (err) {
                    console.log('Error in ${payload.status} Product Pending Dao Transaction -> ', err);
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Updated], message: 'Successfully submitted for approval.' };
            } else {
                console.log('Error Dao: Rejecting Product Pending Transaction -> ', `Error in Product Pending!`);
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `Error in Product Pending!`
                };
            }

            //const query = getRepository(ProductsEntity).createQueryBuilder(Entities.PRODUCTS).update(ProductsEntity).set(payload).where('id = :id', { id });
            //await query.execute();
            //INSERT
        } catch (err) {
            console.log('Error Dao: Update Product Pending -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const deleteProductPending = async (id: string, payload: ProductPendingDaoDeleteInterface) => {
        // await getRepository(ProductsEntity).createQueryBuilder(Entities.PRODUCTS).update(ProductsEntity).set(payload).where('id = :id', { id }).execute();
        //await getRepository(ProductsEntity).delete({ id });

        try {
            const productPendingExist = await getRepository(ProductsPendingEntity).createQueryBuilder(Entities.PRODUCTS_PENDING).where(`UPPER(reference_value) = UPPER('${id}')`).getMany();

            if (productPendingExist.length > 0) {
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `Product ${productPendingExist[0].product_code.toUpperCase()} is already pending for approval!`
                };
            }

            const productMain = await getRepository(ProductsEntity).createQueryBuilder(Entities.PRODUCTS).where(`UPPER(reference_value) = UPPER('${id}')`).getOne();

            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    //INSERT
                    await transactionEntityManager
                        .getRepository(ProductsEntity)
                        .createQueryBuilder(Entities.PRODUCTS)
                        .update(ProductsEntity)
                        .set({ approval_ind: 'Y' })
                        .where('reference_value = :reference_value', { reference_value: id })
                        .execute();

                    await transactionEntityManager
                        .getRepository(ProductsPendingEntity)
                        .createQueryBuilder(Entities.PRODUCTS_PENDING)
                        .insert()
                        .into(ProductsPendingEntity)
                        .values({
                            product_code: productMain?.product_code,
                            product_name: productMain?.product_name,
                            quantity: productMain?.quantity,
                            reference_value: productMain?.reference_value,
                            request_by: payload.request_by,
                            event_request: payload.event_request,
                            request_date: payload.request_date
                        })
                        .execute();

                    return true;
                } catch (err) {
                    console.log('Error Product Pending Dao Transaction -> ', err);
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Deleted], message: 'Successfully submitted for approval.' };
            } else {
                console.log('Error Dao: Rejecting Product Pending Transaction -> ', `Error in Product Pending!`);
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `Error in Product Pending!`
                };
            }
        } catch (err) {
            console.log('Error Dao: delete Product -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const approvalProductPending = async (id: string, payload: ProductPendingDaoApprovalInterface) => {
        try {
            // await getRepository(ProductsEntity).createQueryBuilder(Entities.PRODUCTS).update(ProductsEntity).set(payload).where('id = :id', { id }).execute();

            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    //INSERT
                    if (payload.status === 'Rejected') {
                        if (payload.event_request === 'Modify' || payload.event_request === 'Delete') {
                            await transactionEntityManager
                                .getRepository(ProductsEntity)
                                .createQueryBuilder(Entities.PRODUCTS)
                                .update(ProductsEntity)
                                .set({ approval_ind: 'N' })
                                .where('reference_value = :reference_value', { reference_value: payload.reference_value })
                                .execute();
                        }

                        // await transactionEntityManager
                        //     .getRepository(ProductsPendingEntity)
                        //     .createQueryBuilder(Entities.PRODUCTS_PENDING)
                        //     .update(ProductsPendingEntity)
                        //     .set({ approval_ind: payload.approval_ind })
                        //     .where('reference_value = :reference_value', { reference_value: payload.reference_value })
                        //     .execute();
                    } else {
                        if (payload.event_request === 'Add') {
                            const productPending: any = await transactionEntityManager
                                .getRepository(ProductsPendingEntity)
                                .createQueryBuilder(Entities.PRODUCTS_PENDING)
                                .where('id = :id', { id })
                                .getOne();

                            let data: ProductDaoCreateInterface = {
                                product_code: productPending.product_code,
                                product_name: productPending.product_name,
                                quantity: productPending.quantity,
                                ordered_quantity: 0,
                                forecasted_quantity: productPending.quantity,
                                approval_ind: 'N',
                                created_by: productPending.request_by,
                                reference_value: productPending.reference_value
                            };

                            await transactionEntityManager.getRepository(ProductsEntity).createQueryBuilder(Entities.PRODUCTS).insert().into(ProductsEntity).values(data).execute();
                        } else if (payload.event_request === 'Modify') {
                            await transactionEntityManager
                                .getRepository(ProductsEntity)
                                .createQueryBuilder(Entities.PRODUCTS)
                                .update(ProductsEntity)
                                .set({
                                    product_code: payload.product_code,
                                    product_name: payload.product_name,
                                    quantity: payload.quantity,
                                    approval_ind: 'N',
                                    forecasted_quantity: payload.forecasted_quantity
                                })
                                .where('reference_value = :reference_value', { reference_value: payload.reference_value })
                                .execute();
                        } else if (payload.event_request === 'Delete') {
                            await transactionEntityManager.getRepository(ProductsEntity).createQueryBuilder(Entities.PRODUCTS).delete().where({ reference_value: payload.reference_value }).execute();
                        }
                    }
                    await transactionEntityManager.getRepository(ProductsPendingEntity).delete({ id });

                    return true;
                } catch (err) {
                    console.log('Error in ${payload.status} Product Pending Dao Transaction -> ', err);
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Approval], message: `Successfully ${payload.status}.` };
            } else {
                console.log('Error Dao: Rejecting Product Pending Transaction -> ', `Error in ${payload.status} Product Pending!`);
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `Error in ${payload.status} Product Pending!`
                };
            }
        } catch (err) {
            console.log('Error Dao: delete Product -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const restoreProduct = async (id: string, payload: ProductDaoRestoreInterface) => {
        try {
            await getRepository(ProductsEntity)
                .createQueryBuilder(Entities.PRODUCTS)
                .update(ProductsEntity)
                .set({ ...payload, updated_at: new Date() })
                .where('id = :id', { id })
                .execute();
            await getRepository(ProductsEntity).restore({ id });
            return { ...HTTP_RESPONSES[HttpResponseType.Restored], message: 'Successfully restored.' };
        } catch (err) {
            console.log('Error Dao: restoreProduct -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    // const getProductReport = async (request: ProductRouteInterface) => {
    //     try {
    //         let df_value = request!.df as string;
    //         let dt_value = request!.dt as string;

    //         let df_date: any = moment(new Date(df_value)).format('DD/MM/yyyy');
    //         let dt_date: any = moment(new Date(dt_value)).add(1, 'day').format('DD/MM/yyyy');

    //         let queries: FindManyOptions<ProductEntity> = {
    //             relations: ['personnel_Product'],
    //             where: { created_at: Between(df_date, dt_date) },
    //             order: { created_at: 'ASC' }
    //         };

    //         const results = await ProductEntity.find(queries);

    //         return {
    //             ...HTTP_RESPONSES[HttpResponseType.Success],
    //             message: 'Successfully Retrieved data.',
    //             results
    //         };
    //     } catch (err) {
    //         console.log('Error Dao: Query for getProductReport Transaction -> ', err);
    //         return {
    //             ...HTTP_RESPONSES[HttpResponseType.BadRequest],
    //             message: err.message
    //         };
    //     }
    // };

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
        //getProductReport
    };
};

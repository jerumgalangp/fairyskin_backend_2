import { CustomerDaoCreateInterface, CustomerDaoDeleteInterface, CustomerDaoRestoreInterface, CustomerDaoUpdateInterface } from 'source/interfaces/dao/CustomerDaoInterface';
import { getRepository, InsertResult } from 'typeorm';
import Logger from '../common/logger/winston.logger';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { PaginationDaoInterface } from '../interfaces/dao/PaginationDaoInterface';
import { Entities } from './../constant/Entities';
import { CustomerEntity } from './../entities/CustomerEntities';
import { RoleEntity } from './../entities/RoleEntities';
import { HeadersRouteInterface } from './../interfaces/routes/HttpRoutesInterface';

export const useCustomerDao = () => {
    const getCustomer = async (payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            if (!defaultSort.includes('.')) {
                defaultSort = Entities.CUSTOMER + '.' + defaultSort;
            }

            let where = '';

            if (payload.length > 0) {
                if (payload[0].all_available && payload[0].all_available !== undefined) {
                    where = `(customer_status = '' OR customer_status is null OR Upper(customer_status) like  any (array['%DELIVER%', '%PICKED UP%', '%PARTIAL%']))`;
                } else if (payload[0].id && payload[0].id !== undefined) {
                    where = `user_id not in ('${payload[0].id}')`;
                }
            }
            // const totalPayment: any = getManager()
            //     .createQueryBuilder()
            //     .select('payment_invoice_id', 'payment_invoice_id')
            //     .addSelect('SUM(over_payment)', 'over_payment')
            //     .from(useSchemaAndTableName(Entities.PAYMENT), Entities.PAYMENT)
            //     .groupBy('payment_invoice_id');

            let query = getRepository(CustomerEntity)
                .createQueryBuilder(Entities.CUSTOMER)
                .leftJoinAndSelect(`${Entities.CUSTOMER}.user`, 'user')
                //.leftJoinAndSelect(Entities.ROLES, 'role', `role.id = user.role_id`);
                //.leftJoinAndSelect('(' + totalPayment.getQuery() + ')', 'total_payment', `total_payment."payment_invoice_id" = ${Entities.CUSTOMER}.id`)
                .leftJoinAndSelect(`${Entities.CUSTOMER}.customer_orders`, `${Entities.ORDER}`)
                .leftJoinAndSelect(`${Entities.CUSTOMER}.area`, `${Entities.AREA}`)
                //.leftJoinAndMapOne(`customer_orders`, OrderEntity, `${Entities.ORDER}`, `${Entities.CUSTOMER}.id = ${Entities.ORDER}.customer_id`)
                .leftJoinAndMapOne(`user.role`, RoleEntity, 'role', 'user.role_id = role.id')
                .where(where);

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);

                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        if (f[0] === 'area') {
                            query = query.andWhere(`UPPER(${Entities.AREA}.${f[1]}) Like '%${v.value.toUpperCase()}%' `);
                        } else query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like '%${v.value.toUpperCase()}%' `);
                    } else {
                        query = query.andWhere(`UPPER(${Entities.CUSTOMER}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
                    }
                });
            }

            const count = await query.getCount();

            query
                .skip(pagination.skip)
                .take(pagination.take)
                .orderBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC');
            const results = await query.getMany();

            const total = count; //results.length; //await UserEntity.count(queries);
            let pageCount = Math.ceil(total / pagination.take) || 1;

            return {
                ...HTTP_RESPONSES[HttpResponseType.Success],
                message: 'Successfully Retrieved data.',
                results,
                pagination: { total, current: pagination.current, pageCount }
            };
        } catch (err) {
            Logger.error('Error Dao: Query for getCustomer Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const createCustomer = async (payload: CustomerDaoCreateInterface) => {
        try {
            const query = getRepository(CustomerEntity).createQueryBuilder(Entities.CUSTOMER).insert().into(CustomerEntity).values(payload);
            const data: InsertResult = await query.execute();
            const { id } = data.identifiers[0];
            return { ...HTTP_RESPONSES[HttpResponseType.Created], id, message: 'Successfully created.' };
        } catch (err) {
            console.log('Error Dao: Create Customer Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const updateCustomer = async (id: string, payload: CustomerDaoUpdateInterface) => {
        try {
            // console.log('------------');
            // console.log(payload);
            // console.log('------------');
            const query = getRepository(CustomerEntity).createQueryBuilder(Entities.CUSTOMER).update(CustomerEntity).set(payload).where('id = :id', { id });
            await query.execute();
            return { ...HTTP_RESPONSES[HttpResponseType.Updated], message: 'Successfully updated.' };
        } catch (err) {
            console.log('Error Dao: update Customer -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const deleteCustomer = async (id: string, payload: CustomerDaoDeleteInterface) => {
        try {
            await getRepository(CustomerEntity).createQueryBuilder(Entities.CUSTOMER).update(CustomerEntity).set(payload).where('id = :id', { id }).execute();
            await getRepository(CustomerEntity).delete({ id });
            return { ...HTTP_RESPONSES[HttpResponseType.Deleted], message: 'Successfully deleted.' };
        } catch (err) {
            console.log('Error Dao: delete Customer -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const restoreCustomer = async (id: string, payload: CustomerDaoRestoreInterface) => {
        try {
            await getRepository(CustomerEntity)
                .createQueryBuilder(Entities.CUSTOMER)
                .update(CustomerEntity)
                .set({ ...payload, updated_at: new Date() })
                .where('id = :id', { id })
                .execute();
            await getRepository(CustomerEntity).restore({ id });
            return { ...HTTP_RESPONSES[HttpResponseType.Restored], message: 'Successfully restored.' };
        } catch (err) {
            console.log('Error Dao: restoreCustomer -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    return {
        getCustomer,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        restoreCustomer
    };
};

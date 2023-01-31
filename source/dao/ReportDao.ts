import { getManager, getRepository } from 'typeorm';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { PaginationDaoInterface } from '../interfaces/dao/PaginationDaoInterface';
import { Entities } from './../constant/Entities';
import { AreaEntity } from './../entities/AreaEntities';
import { CustomerEntity } from './../entities/CustomerEntities';
import { OrderEntity } from './../entities/OrderEntities';
import { ProductsEntity } from './../entities/ProductEntities';
import { HeadersRouteInterface } from './../interfaces/routes/HttpRoutesInterface';
import { useSchemaAndTableName } from './../util/Schema';

export const useReportDao = () => {
    const getQSPR = async (payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = 'area_name';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            if (!defaultSort.includes('.')) {
                defaultSort = Entities.AREA + '.' + defaultSort;
            }

            //let query = getRepository(AreaEntity).createQueryBuilder(Entities.AREA);

            let where = '';

            if (payload.length > 0) {
                let date_from = payload[0];
                let date_to = payload[1];
                where = `DATE(${Entities.ORDER}.CREATED_AT) BETWEEN DATE('${date_from.df._value}') AND DATE('${date_to.dt._value}')`;
            }

            let query: any = getManager()
                .createQueryBuilder()
                .select('area_name', 'region')
                .addSelect(`${Entities.PRODUCTS}.product_name`, 'product')
                .addSelect(`SUM(${Entities.ORDER_PRODUCTS}.quantity)`, 'quantity_sold')
                //.addSelect(`MAX(${Entities.ORDER_PRODUCTS}.price)`, 'price_sold')
                .addSelect(`SUM(${Entities.ORDER_PRODUCTS}.total)`, 'total')
                .from(useSchemaAndTableName(Entities.ORDER_PRODUCTS), Entities.ORDER_PRODUCTS)
                .leftJoin(OrderEntity, `${Entities.ORDER}`, `${Entities.ORDER}.id = ${Entities.ORDER_PRODUCTS}."orderId"`)
                .leftJoin(CustomerEntity, `${Entities.CUSTOMER}`, `${Entities.CUSTOMER}.id = ${Entities.ORDER}.customer_id`)
                .leftJoin(AreaEntity, `${Entities.AREA}`, `${Entities.AREA}.id = ${Entities.CUSTOMER}.customer_area`)
                .leftJoin(ProductsEntity, `${Entities.PRODUCTS}`, `${Entities.PRODUCTS}.id = ${Entities.ORDER_PRODUCTS}."productId"`)
                .where(where)
                .groupBy(`area_name`)
                .addGroupBy(`${Entities.ORDER_PRODUCTS}."productId"`)
                .addGroupBy(`${Entities.PRODUCTS}.product_name`);

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);
                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like :q`, { q: `%${v.value.toUpperCase()}%` });
                    } else {
                        query = query.andWhere(`UPPER(${Entities.AREA}.${v.id}) Like :q`, { q: `%${v.value.toUpperCase()}%` });
                    }
                });
            }

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
            console.log('Error Dao: Query for getAreaDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };
    const getTSPR = async (_payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            if (!defaultSort.includes('.')) {
                defaultSort = Entities.AREA + '.' + defaultSort;
            }

            let query = getRepository(AreaEntity).createQueryBuilder(Entities.AREA);

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);

                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like '%${v.value.toUpperCase()}%' `);
                    } else {
                        query = query.andWhere(`UPPER(${Entities.AREA}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
                    }
                });
            }
            const count = await query.getCount();

            query
                .skip(pagination.skip)
                .take(pagination.take)
                .orderBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC');

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
            console.log('Error Dao: Query for getAreaDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const getPPR = async (_payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            if (!defaultSort.includes('.')) {
                defaultSort = Entities.AREA + '.' + defaultSort;
            }

            let query = getRepository(AreaEntity).createQueryBuilder(Entities.AREA);

            if (headers.filters !== undefined && headers.filters?.length > 0) {
                let filters = JSON.parse(headers.filters);

                filters.map((v: any) => {
                    if (v.id.includes('.')) {
                        let f = v.id.split('.');
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like '%${v.value.toUpperCase()}%' `);
                    } else {
                        query = query.andWhere(`UPPER(${Entities.AREA}.${v.id}) Like '%${v.value.toUpperCase()}%' `);
                    }
                });
            }
            const count = await query.getCount();

            query
                .skip(pagination.skip)
                .take(pagination.take)
                .orderBy(defaultSort, headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC');

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
            console.log('Error Dao: Query for getAreaDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    return {
        getQSPR,
        getTSPR,
        getPPR
    };
};

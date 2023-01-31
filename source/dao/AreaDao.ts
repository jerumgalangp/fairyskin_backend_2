import { AreaDaoCreateInterface, AreaDaoDeleteInterface, AreaDaoRestoreInterface, AreaDaoUpdateInterface } from 'source/interfaces/dao/AreaDaoInterface';
import { getManager, getRepository, InsertResult } from 'typeorm';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { PaginationDaoInterface } from '../interfaces/dao/PaginationDaoInterface';
import { Entities } from './../constant/Entities';
import { AreaEntity } from './../entities/AreaEntities';
import { HeadersRouteInterface } from './../interfaces/routes/HttpRoutesInterface';

export const useAreaDao = () => {
    const getAllArea = async (_payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
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
                        query = query.andWhere(`UPPER(${f[0]}.${f[1]}) Like :q`, { q: `%${v.value.toUpperCase()}%` });
                    } else {
                        query = query.andWhere(`UPPER(${Entities.AREA}.${v.id}) Like :q`, { q: `%${v.value.toUpperCase()}%` });
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
            console.log('Error Dao: Query for getAreaDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };
    const getArea = async (_payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
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

    const createArea = async (payload: AreaDaoCreateInterface) => {
        try {
            let Area_id: any;
            const userExist = await getRepository(AreaEntity).createQueryBuilder(Entities.AREA).where(`UPPER(Area_name) = UPPER('${payload.area_name}')`).getMany();

            if (userExist.length > 0) {
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `User ${payload.area_name.toUpperCase()} already exist!`
                };
            }

            const transaction = await getManager().transaction(async (transactionEntityManager) => {
                try {
                    //INSERT
                    const data: InsertResult = await transactionEntityManager.getRepository(AreaEntity).createQueryBuilder(Entities.AREA).insert().into(AreaEntity).values(payload).execute();

                    let { id } = data.identifiers[0];

                    Area_id = id;

                    return true;
                } catch (err) {
                    console.log('Error Dao: Deleting Area Dao Transaction -> ', err);
                    return false;
                }
            });

            if (transaction) {
                return { ...HTTP_RESPONSES[HttpResponseType.Created], Area_id, message: 'Successfully created.' };
            } else {
                console.log('Error Dao: Create Area Transaction -> ', 'Error Creating Area!');
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: 'Error Creating Area!'
                };
            }
        } catch (err) {
            console.log('Error Dao: Create Area Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const updateArea = async (id: string, payload: AreaDaoUpdateInterface) => {
        try {
            const query = getRepository(AreaEntity).createQueryBuilder(Entities.AREA).update(AreaEntity).set(payload).where('id = :id', { id });
            await query.execute();
            return { ...HTTP_RESPONSES[HttpResponseType.Updated], message: 'Successfully updated.' };
        } catch (err) {
            console.log('Error Dao: update Area -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const deleteArea = async (id: string, _payload: AreaDaoDeleteInterface) => {
        try {
            //await getRepository(AreaEntity).createQueryBuilder(Entities.AreaS).update(AreaEntity).set(payload).where('id = :id', { id }).execute();
            await getRepository(AreaEntity).delete({ id });
            return { ...HTTP_RESPONSES[HttpResponseType.Deleted], message: 'Successfully deleted.' };
        } catch (err) {
            console.log('Error Dao: delete Area -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const restoreArea = async (id: string, payload: AreaDaoRestoreInterface) => {
        try {
            await getRepository(AreaEntity)
                .createQueryBuilder(Entities.AREA)
                .update(AreaEntity)
                .set({ ...payload, updated_at: new Date() })
                .where('id = :id', { id })
                .execute();
            await getRepository(AreaEntity).restore({ id });
            return { ...HTTP_RESPONSES[HttpResponseType.Restored], message: 'Successfully restored.' };
        } catch (err) {
            console.log('Error Dao: restoreArea -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    // const getAreaReport = async (request: AreaRouteInterface) => {
    //     try {
    //         let df_value = request!.df as string;
    //         let dt_value = request!.dt as string;

    //         let df_date: any = moment(new Date(df_value)).format('DD/MM/yyyy');
    //         let dt_date: any = moment(new Date(dt_value)).add(1, 'day').format('DD/MM/yyyy');

    //         let queries: FindManyOptions<AreaEntity> = {
    //             relations: ['personnel_Area'],
    //             where: { created_at: Between(df_date, dt_date) },
    //             order: { created_at: 'ASC' }
    //         };

    //         const results = await AreaEntity.find(queries);

    //         return {
    //             ...HTTP_RESPONSES[HttpResponseType.Success],
    //             message: 'Successfully Retrieved data.',
    //             results
    //         };
    //     } catch (err) {
    //         console.log('Error Dao: Query for getAreaReport Transaction -> ', err);
    //         return {
    //             ...HTTP_RESPONSES[HttpResponseType.BadRequest],
    //             message: err.message
    //         };
    //     }
    // };

    return {
        getAllArea,
        getArea,
        createArea,
        updateArea,
        deleteArea,
        restoreArea
        //getAreaReport
    };
};

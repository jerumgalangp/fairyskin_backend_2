import { ParameterDaoCreateInterface, ParameterDaoDeleteInterface, ParameterDaoRestoreInterface, ParameterDaoUpdateInterface } from 'source/interfaces/dao/ParameterDaoInterface';
import { FindManyOptions, getRepository, InsertResult } from 'typeorm';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { PaginationDaoInterface } from '../interfaces/dao/PaginationDaoInterface';
import { Entities } from './../constant/Entities';
import { ParameterEntity } from './../entities/ParameterEntities';
import { HeadersRouteInterface } from './../interfaces/routes/HttpRoutesInterface';

export const useParameterDao = () => {
    const getParameter = async (payload: { [column: string]: any }[], pagination: PaginationDaoInterface, headers: HeadersRouteInterface) => {
        try {
            let defaultSort = 'created_at';
            if (headers.sort_by !== undefined) defaultSort = headers.sort_by;

            let queries: FindManyOptions<ParameterEntity> = {
                withDeleted: headers.withdeleted === 'true',
                order: { [defaultSort]: headers.sort ? (headers.sort === 'DESC' ? 'DESC' : 'ASC') : 'DESC', parameter_name: 'ASC', parameter_value: 'DESC' },
                skip: pagination.skip,
                take: pagination.take
            };

            if (payload.length > 0) queries = { ...queries, where: payload };

            const results = await ParameterEntity.find(queries);
            const total = await ParameterEntity.count(queries);

            return {
                ...HTTP_RESPONSES[HttpResponseType.Success],
                message: 'Successfully Retrieved data.',
                results,
                pagination: { total, current: pagination.current }
            };
        } catch (err) {
            console.log('Error Dao: Query for getParameterDao Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const createParameter = async (payload: ParameterDaoCreateInterface) => {
        try {
            const paramExist = await getRepository(ParameterEntity)
                .createQueryBuilder(Entities.PARAMETER)
                .where('parameter_type = :paramter_type AND parameter_value = :parameter_value', { paramter_type: payload.parameter_type, parameter_value: payload.parameter_value })
                .getMany();

            if (paramExist.length > 0) {
                return {
                    ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                    message: `Parameter ${payload.parameter_type.toUpperCase()} already exist!`
                };
            }

            const query = getRepository(ParameterEntity).createQueryBuilder(Entities.PARAMETER).insert().into(ParameterEntity).values(payload);

            const data: InsertResult = await query.execute();
            const { id } = data.identifiers[0];

            return { ...HTTP_RESPONSES[HttpResponseType.Created], id, message: 'Successfully created.' };
        } catch (err) {
            console.log('Error Dao: Create Parameter Transaction -> ', err);
            return {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: err.message
            };
        }
    };

    const updateParameter = async (id: string, payload: ParameterDaoUpdateInterface) => {
        try {
            const query = getRepository(ParameterEntity).createQueryBuilder(Entities.PARAMETER).update(ParameterEntity).set(payload).where('id = :id', { id });
            await query.execute();
            return { ...HTTP_RESPONSES[HttpResponseType.Updated], message: 'Successfully updated.' };
        } catch (err) {
            console.log('Error Dao: update Parameter -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const deleteParameter = async (id: string, payload: ParameterDaoDeleteInterface) => {
        try {
            await getRepository(ParameterEntity).createQueryBuilder(Entities.PARAMETER).update(ParameterEntity).set(payload).where('id = :id', { id }).execute();
            await getRepository(ParameterEntity).delete({ id });
            return { ...HTTP_RESPONSES[HttpResponseType.Deleted], message: 'Successfully deleted.' };
        } catch (err) {
            console.log('Error Dao: delete Parameter -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    const restoreParameter = async (id: string, payload: ParameterDaoRestoreInterface) => {
        try {
            await getRepository(ParameterEntity)
                .createQueryBuilder(Entities.PARAMETER)
                .update(ParameterEntity)
                .set({ ...payload, updated_at: new Date() })
                .where('id = :id', { id })
                .execute();
            await getRepository(ParameterEntity).restore({ id });
            return { ...HTTP_RESPONSES[HttpResponseType.Restored], message: 'Successfully restored.' };
        } catch (err) {
            console.log('Error Dao: restoreParameter -> ', err);
            return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: err.message };
        }
    };

    return {
        getParameter,
        createParameter,
        updateParameter,
        deleteParameter,
        restoreParameter
    };
};

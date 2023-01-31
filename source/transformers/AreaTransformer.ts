import { AreaDaoCreateInterface, AreaDaoDeleteInterface, AreaDaoRestoreInterface, AreaDaoUpdateInterface } from 'source/interfaces/dao/AreaDaoInterface';
import { ILike, In } from 'typeorm';
import { AreaRouteCreateInterface, AreaRouteInterface, AreaRouteUpdateInterface } from '../interfaces/routes/AreaRouteInterface';

export const useAreaTransformPayload = (request: AreaRouteInterface): { [column: string]: any }[] => {
    const idColumns = ['id'];
    return Object.entries(request || {})
        .reduce(
            (accum, current) => {
                const [column, value] = current;
                if (!value) return accum;
                const argValue = () => {
                    if (!idColumns.includes(column)) return ILike(`%${value}%`);
                    if (value.constructor === Array) return In(value);
                    return value;
                };
                return [...accum, { [column]: argValue() }];
            },
            [{}]
        )
        .filter((data) => Object.keys(data).length > 0);
};

export const useAreaTransformCreatePayload = (userData: { id: string; table: string }, request: AreaRouteCreateInterface): AreaDaoCreateInterface => {
    return {
        ...request,
        created_by: userData.id
    };
};

export const useAreaTransformUpdatePayload = (userData: { id: string; table: string }, request: AreaRouteUpdateInterface): AreaDaoUpdateInterface => {
    return {
        ...request,
        updated_by: userData.id
    };
};

export const useAreaTransformDeletePayload = (userData: { id: string; table: string }): AreaDaoDeleteInterface => {
    return {
        deleted_by: userData.id
    };
};

export const useAreaTransformRestorePayload = (userData: { id: string; table: string }): AreaDaoRestoreInterface => {
    return {
        updated_by: userData.id
    };
};

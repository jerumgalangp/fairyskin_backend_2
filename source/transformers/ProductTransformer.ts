import { ProductDaoCreateInterface, ProductDaoDeleteInterface, ProductDaoRestoreInterface, ProductDaoUpdateInterface } from 'source/interfaces/dao/ProductDaoInterface';
import { ILike, In } from 'typeorm';
import { ProductRouteCreateInterface, ProductRouteInterface, ProductRouteUpdateInterface } from '../interfaces/routes/ProductRouteInterface';

export const useProductTransformPayload = (request: ProductRouteInterface): { [column: string]: any }[] => {
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

export const useProductTransformCreatePayload = (userData: { id: string; table: string }, request: ProductRouteCreateInterface): ProductDaoCreateInterface => {
    return {
        ...request,
        created_by: userData.id
    };
};

export const useProductTransformUpdatePayload = (userData: { id: string; table: string }, request: ProductRouteUpdateInterface): ProductDaoUpdateInterface => {
    return {
        ...request,
        updated_by: userData.id
    };
};

export const useProductTransformDeletePayload = (userData: { id: string; table: string }): ProductDaoDeleteInterface => {
    return {
        deleted_by: userData.id
    };
};

export const useProductTransformRestorePayload = (userData: { id: string; table: string }): ProductDaoRestoreInterface => {
    return {
        updated_by: userData.id
    };
};

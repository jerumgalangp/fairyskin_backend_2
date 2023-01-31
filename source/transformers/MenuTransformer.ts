import { MenuDaoCreateInterface, MenuDaoDeleteInterface, MenuDaoRestoreInterface, MenuDaoUpdateInterface } from 'source/interfaces/dao/MenuDaoInterface';
import { ILike, In } from 'typeorm';
import { MenuRouteCreateInterface, MenuRouteInterface, MenuRouteUpdateInterface } from '../interfaces/routes/MenuRouteInterface';

export const useMenuTransformPayload = (request: MenuRouteInterface): { [column: string]: any }[] => {
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

export const useMenuTransformCreatePayload = (userData: { id: string; table: string }, request: MenuRouteCreateInterface): MenuDaoCreateInterface => {
    return {
        ...request,
        created_by: userData.id
    };
};

export const useMenuTransformUpdatePayload = (userData: { id: string; table: string }, request: MenuRouteUpdateInterface): MenuDaoUpdateInterface => {
    return {
        ...request,
        updated_by: userData.id
    };
};

export const useMenuTransformDeletePayload = (userData: { id: string; table: string }): MenuDaoDeleteInterface => {
    return {
        deleted_by: userData.id
    };
};

export const useMenuTransformRestorePayload = (userData: { id: string; table: string }): MenuDaoRestoreInterface => {
    return {
        updated_by: userData.id
    };
};

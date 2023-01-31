import { RoleDaoCreateInterface, RoleDaoDeleteInterface, RoleDaoRestoreInterface, RoleDaoUpdateInterface } from 'source/interfaces/dao/RoleDaoInterface';
import { ILike, In } from 'typeorm';
import { RoleRouteCreateInterface, RoleRouteInterface, RoleRouteUpdateInterface } from '../interfaces/routes/RoleRouteInterface';

export const useRoleTransformPayload = (request: RoleRouteInterface): { [column: string]: any }[] => {
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

export const useRoleTransformCreatePayload = (userData: { id: string; table: string }, request: RoleRouteCreateInterface): RoleDaoCreateInterface => {
    return {
        ...request,
        created_by: userData.id
    };
};

export const useRoleTransformUpdatePayload = (userData: { id: string; table: string }, request: RoleRouteUpdateInterface): RoleDaoUpdateInterface => {
    return {
        ...request,
        updated_by: userData.id
    };
};

export const useRoleTransformDeletePayload = (userData: { id: string; table: string }): RoleDaoDeleteInterface => {
    return {
        deleted_by: userData.id
    };
};

export const useRoleTransformRestorePayload = (userData: { id: string; table: string }): RoleDaoRestoreInterface => {
    return {
        updated_by: userData.id
    };
};

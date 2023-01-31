import { UserDaoCreateInterface, UserDaoDeleteInterface, UserDaoResetPasswordInterface, UserDaoUpdateInterface } from 'source/interfaces/dao/UserDaoInterface';
import { ILike, In } from 'typeorm';
import { UserRouteCreateInterface, UserRouteInterface, UserRouteResetPasswordInterface, UserRouteUpdateInterface } from '../interfaces/routes/UserRouteInterface';

export const useUserTransformPayload = (request: UserRouteInterface): { [column: string]: any }[] => {
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

export const useUserTransformPayload2 = (request: UserRouteInterface): { [column: string]: any }[] => {
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

export const useUserTransformCreatePayload = (userData: { id: string; table: string }, request: UserRouteCreateInterface): UserDaoCreateInterface => {
    return {
        ...request,
        created_by: userData.id
    };
};

export const useUserTransformUpdatePayload = (userData: { id: string; table: string }, request: UserRouteUpdateInterface): UserDaoUpdateInterface => {
    return {
        ...request,
        updated_by: userData.id
    };
};

export const useUserTransformDeletePayload = (userData: { id: string; table: string }): UserDaoDeleteInterface => {
    return {
        deleted_by: userData.id
    };
};

export const useUserTransformResetPasswordPayload = (userData: { id: string; table: string }, request: UserRouteResetPasswordInterface): UserDaoResetPasswordInterface => {
    return {
        ...request,
        updated_by: userData.id
    };
};

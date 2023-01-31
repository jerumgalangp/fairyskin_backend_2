import { EWTDaoCreateInterface, EWTDaoDeleteInterface, EWTDaoRestoreInterface, EWTDaoUpdateInterface } from 'source/interfaces/dao/EWTDaoInterface';
import { ILike, In } from 'typeorm';
import { EWTRouteCreateInterface, EWTRouteInterface, EWTRouteUpdateInterface } from '../interfaces/routes/EWTRouteInterface';

export const useEWTTransformPayload = (request: EWTRouteInterface): { [column: string]: any }[] => {
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

export const useEWTTransformCreatePayload = (userData: { id: string; table: string }, request: EWTRouteCreateInterface): EWTDaoCreateInterface => {
    return {
        ...request,
        created_by: userData.id
    };
};

export const useEWTTransformUpdatePayload = (userData: { id: string; table: string }, request: EWTRouteUpdateInterface): EWTDaoUpdateInterface => {
    return {
        ...request,
        updated_by: userData.id
    };
};

export const useEWTTransformDeletePayload = (userData: { id: string; table: string }): EWTDaoDeleteInterface => {
    return {
        deleted_by: userData.id
    };
};

export const useEWTTransformRestorePayload = (userData: { id: string; table: string }): EWTDaoRestoreInterface => {
    return {
        updated_by: userData.id
    };
};

// export const useEWTTransformPayload = (request: EWTRouteInterface): any => {
//     return {
//         id: request.id
//     };
// };

// export const useEWTTransformCreatePayload = (request: EWTRouteCreateInterface): EWTDaoCreateInterface => {
//     return {
//         ...request,
//         created_by: 'JERUM_CREATE',
//         created_at: new Date()
//     };
// };

// export const useEWTTransformUpdatePayload = (request: EWTRouteUpdateInterface): EWTDaoUpdateInterface => {
//     return {
//         ...request,
//         updated_by: 'JERUM_UPDATE',
//         updated_at: new Date()
//     };
// };

// export const useEWTTransformDeletePayload = () => {
//     return {
//         deleted_by: 'JERUM_DELETE',
//         deleted_at: new Date()
//     };
// };

// export const useEWTTransformRestorePayload = () => {
//     return {
//         updated_by: 'JERUM_UPDATE'
//     };
// };

import { ParameterDaoCreateInterface, ParameterDaoDeleteInterface, ParameterDaoRestoreInterface, ParameterDaoUpdateInterface } from 'source/interfaces/dao/ParameterDaoInterface';
import { ILike, In } from 'typeorm';
import { ParameterRouteCreateInterface, ParameterRouteInterface, ParameterRouteUpdateInterface } from '../interfaces/routes/ParameterRouteInterface';

export const useParameterTransformPayload = (request: ParameterRouteInterface): { [column: string]: any }[] => {
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

export const useParameterTransformCreatePayload = (userData: { id: string; table: string }, request: ParameterRouteCreateInterface): ParameterDaoCreateInterface => {
    return {
        ...request,
        created_by: userData.id
    };
};

export const useParameterTransformUpdatePayload = (userData: { id: string; table: string }, request: ParameterRouteUpdateInterface): ParameterDaoUpdateInterface => {
    return {
        ...request,
        updated_by: userData.id
    };
};

export const useParameterTransformDeletePayload = (userData: { id: string; table: string }): ParameterDaoDeleteInterface => {
    return {
        deleted_by: userData.id
    };
};

export const useParameterTransformRestorePayload = (userData: { id: string; table: string }): ParameterDaoRestoreInterface => {
    return {
        updated_by: userData.id
    };
};

// export const useParameterTransformPayload = (request: ParameterRouteInterface): any => {
//     return {
//         id: request.id
//     };
// };

// export const useParameterTransformCreatePayload = (request: ParameterRouteCreateInterface): ParameterDaoCreateInterface => {
//     return {
//         ...request,
//         created_by: 'JERUM_CREATE',
//         created_at: new Date()
//     };
// };

// export const useParameterTransformUpdatePayload = (request: ParameterRouteUpdateInterface): ParameterDaoUpdateInterface => {
//     return {
//         ...request,
//         updated_by: 'JERUM_UPDATE',
//         updated_at: new Date()
//     };
// };

// export const useParameterTransformDeletePayload = () => {
//     return {
//         deleted_by: 'JERUM_DELETE',
//         deleted_at: new Date()
//     };
// };

// export const useParameterTransformRestorePayload = () => {
//     return {
//         updated_by: 'JERUM_UPDATE'
//     };
// };

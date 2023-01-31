import { CustomerDaoCreateInterface, CustomerDaoDeleteInterface, CustomerDaoRestoreInterface, CustomerDaoUpdateInterface } from 'source/interfaces/dao/CustomerDaoInterface';
import { ILike, In } from 'typeorm';
import { CustomerRouteCreateInterface, CustomerRouteInterface, CustomerRouteUpdateInterface } from '../interfaces/routes/CustomerRouteInterface';

export const useCustomerTransformPayload = (request: CustomerRouteInterface): { [column: string]: any }[] => {
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

export const useCustomerTransformCreatePayload = (userData: { id: string; table: string }, request: CustomerRouteCreateInterface): CustomerDaoCreateInterface => {
    return {
        ...request,
        created_by: userData.id
    };
};

export const useCustomerTransformUpdatePayload = (userData: { id: string; table: string }, request: CustomerRouteUpdateInterface): CustomerDaoUpdateInterface => {
    return {
        ...request,
        updated_by: userData.id
    };
};

export const useCustomerTransformDeletePayload = (userData: { id: string; table: string }): CustomerDaoDeleteInterface => {
    return {
        deleted_by: userData.id
    };
};

export const useCustomerTransformRestorePayload = (userData: { id: string; table: string }): CustomerDaoRestoreInterface => {
    return {
        updated_by: userData.id
    };
};

// export const useCustomerTransformPayload = (request: CustomerRouteInterface): any => {
//     return {
//         id: request.id
//     };
// };

// export const useCustomerTransformCreatePayload = (request: CustomerRouteCreateInterface): CustomerDaoCreateInterface => {
//     return {
//         ...request,
//         created_by: 'JERUM_CREATE',
//         created_at: new Date()
//     };
// };

// export const useCustomerTransformUpdatePayload = (request: CustomerRouteUpdateInterface): CustomerDaoUpdateInterface => {
//     return {
//         ...request,
//         updated_by: 'JERUM_UPDATE',
//         updated_at: new Date()
//     };
// };

// export const useCustomerTransformDeletePayload = () => {
//     return {
//         deleted_by: 'JERUM_DELETE',
//         deleted_at: new Date()
//     };
// };

// export const useCustomerTransformRestorePayload = () => {
//     return {
//         updated_by: 'JERUM_UPDATE'
//     };
// };

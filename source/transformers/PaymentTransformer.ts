import { PaymentDaoCreateInterface, PaymentDaoDeleteInterface, PaymentDaoRestoreInterface, PaymentDaoUpdateInterface } from 'source/interfaces/dao/PaymentDaoInterface';
import { ILike, In } from 'typeorm';
import { PaymentRouteCreateInterface, PaymentRouteInterface, PaymentRouteUpdateInterface } from '../interfaces/routes/PaymentRouteInterface';

export const usePaymentTransformPayload = (request: PaymentRouteInterface): { [column: string]: any }[] => {
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

export const usePaymentHistoryTransformPayload = (request: PaymentRouteInterface): { [column: string]: any }[] => {
    const idColumns = ['payment_invoice_id'];
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

export const usePaymentTransformCreatePayload = (userData: { id: string; table: string }, request: PaymentRouteCreateInterface): PaymentDaoCreateInterface => {
    return {
        ...request,
        created_by: userData.id
    };
};

export const usePaymentTransformUpdatePayload = (userData: { id: string; table: string }, request: PaymentRouteUpdateInterface): PaymentDaoUpdateInterface => {
    return {
        ...request,
        updated_by: userData.id
    };
};

export const usePaymentTransformDeletePayload = (userData: { id: string; table: string }): PaymentDaoDeleteInterface => {
    return {
        deleted_by: userData.id
    };
};

export const usePaymentTransformRestorePayload = (userData: { id: string; table: string }): PaymentDaoRestoreInterface => {
    return {
        updated_by: userData.id
    };
};

// export const usePaymentTransformPayload = (request: PaymentRouteInterface): any => {
//     return {
//         id: request.id
//     };
// };

// export const usePaymentTransformCreatePayload = (request: PaymentRouteCreateInterface): PaymentDaoCreateInterface => {
//     return {
//         ...request,
//         created_by: 'JERUM_CREATE',
//         created_at: new Date()
//     };
// };

// export const usePaymentTransformUpdatePayload = (request: PaymentRouteUpdateInterface): PaymentDaoUpdateInterface => {
//     return {
//         ...request,
//         updated_by: 'JERUM_UPDATE',
//         updated_at: new Date()
//     };
// };

// export const usePaymentTransformDeletePayload = () => {
//     return {
//         deleted_by: 'JERUM_DELETE',
//         deleted_at: new Date()
//     };
// };

// export const usePaymentTransformRestorePayload = () => {
//     return {
//         updated_by: 'JERUM_UPDATE'
//     };
// };

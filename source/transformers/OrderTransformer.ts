import { OrderDaoCreateInterface, OrderDaoDeleteInterface, OrderDaoRestoreInterface, OrderDaoUpdateInterface } from 'source/interfaces/dao/OrderDaoInterface';
import { ILike, In } from 'typeorm';
import { OrderRouteCreateInterface, OrderRouteInterface, OrderRouteUpdateInterface } from '../interfaces/routes/OrderRouteInterface';

export const useOrderTransformPayload = (request: OrderRouteInterface): { [column: string]: any }[] => {
    const idColumns = ['order_status'];
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

export const useOrderDeliveryTransformPayload = (request: OrderRouteInterface): { [column: string]: any }[] => {
    const idColumns = ['order_status'];
    return Object.entries(request || {})
        .reduce(
            (accum, current) => {
                const [column, value] = current;
                if (!value) return accum;
                const argValue = () => {
                    if (!idColumns.includes(column)) return ILike(`${value}`);
                    if (value.constructor === Array) return In(value);
                    return value;
                };
                return [...accum, { [column]: argValue() }];
            },
            [{}]
        )
        .filter((data) => Object.keys(data).length > 0);
};

export const useOrderProductTransformPayload = (request: OrderRouteInterface): { [column: string]: any }[] => {
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

export const useOrderDeliverProductTransformPayload = (request: OrderRouteInterface): { [column: string]: any }[] => {
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

export const useOrderTransformCreatePayload = (userData: { id: string; table: string }, request: OrderRouteCreateInterface): OrderDaoCreateInterface => {
    return {
        ...request,
        created_by: userData.id
    };
};

export const useOrderTransformUpdatePayload = (userData: { id: string; table: string }, request: OrderRouteUpdateInterface): OrderDaoUpdateInterface => {
    return {
        ...request,
        updated_by: userData.id
    };
};

export const useOrderTransformDeletePayload = (userData: { id: string; table: string }): OrderDaoDeleteInterface => {
    return {
        deleted_by: userData.id
    };
};

export const useOrderTransformRestorePayload = (userData: { id: string; table: string }): OrderDaoRestoreInterface => {
    return {
        updated_by: userData.id
    };
};

// export const useOrderTransformPayload = (request: OrderRouteInterface): any => {
//     return {
//         id: request.id
//     };
// };

// export const useOrderTransformCreatePayload = (request: OrderRouteCreateInterface): OrderDaoCreateInterface => {
//     return {
//         ...request,
//         created_by: 'JERUM_CREATE',
//         created_at: new Date()
//     };
// };

// export const useOrderTransformUpdatePayload = (request: OrderRouteUpdateInterface): OrderDaoUpdateInterface => {
//     return {
//         ...request,
//         updated_by: 'JERUM_UPDATE',
//         updated_at: new Date()
//     };
// };

// export const useOrderTransformDeletePayload = () => {
//     return {
//         deleted_by: 'JERUM_DELETE',
//         deleted_at: new Date()
//     };
// };

// export const useOrderTransformRestorePayload = () => {
//     return {
//         updated_by: 'JERUM_UPDATE'
//     };
// };

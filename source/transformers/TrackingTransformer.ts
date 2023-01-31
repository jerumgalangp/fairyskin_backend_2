import { TrackingDaoCreateInterface, TrackingDaoDeleteInterface, TrackingDaoRestoreInterface, TrackingDaoUpdateInterface } from 'source/interfaces/dao/TrackingDaoInterface';
import { ILike, In } from 'typeorm';
import { TrackingRouteCreateInterface, TrackingRouteInterface, TrackingRouteUpdateInterface } from '../interfaces/routes/TrackingRouteInterface';

export const useOrderTrackingTransformPayload = (request: TrackingRouteInterface): { [column: string]: any }[] => {
    const idColumns = ['customer_name'];
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

export const useTrackingTransformPayload = (request: TrackingRouteInterface): { [column: string]: any }[] => {
    const idColumns = ['Tracking_status'];
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

export const useOrderDistributedTransformPayload = (request: TrackingRouteInterface): { [column: string]: any }[] => {
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

export const useTrackingProductTransformPayload = (request: TrackingRouteInterface): { [column: string]: any }[] => {
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

export const useTrackingDeliverProductTransformPayload = (request: TrackingRouteInterface): { [column: string]: any }[] => {
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

export const useTrackingTransformCreatePayload = (userData: { id: string; table: string }, request: TrackingRouteCreateInterface): TrackingDaoCreateInterface => {
    return {
        ...request,
        created_by: userData.id
    };
};

export const useTrackingTransformUpdatePayload = (userData: { id: string; table: string }, request: TrackingRouteUpdateInterface): TrackingDaoUpdateInterface => {
    return {
        ...request,
        updated_by: userData.id
    };
};

export const useTrackingTransformDeletePayload = (userData: { id: string; table: string }): TrackingDaoDeleteInterface => {
    return {
        deleted_by: userData.id
    };
};

export const useTrackingTransformRestorePayload = (userData: { id: string; table: string }): TrackingDaoRestoreInterface => {
    return {
        updated_by: userData.id
    };
};

// export const useTrackingTransformPayload = (request: TrackingRouteInterface): any => {
//     return {
//         id: request.id
//     };
// };

// export const useTrackingTransformCreatePayload = (request: TrackingRouteCreateInterface): TrackingDaoCreateInterface => {
//     return {
//         ...request,
//         created_by: 'JERUM_CREATE',
//         created_at: new Date()
//     };
// };

// export const useTrackingTransformUpdatePayload = (request: TrackingRouteUpdateInterface): TrackingDaoUpdateInterface => {
//     return {
//         ...request,
//         updated_by: 'JERUM_UPDATE',
//         updated_at: new Date()
//     };
// };

// export const useTrackingTransformDeletePayload = () => {
//     return {
//         deleted_by: 'JERUM_DELETE',
//         deleted_at: new Date()
//     };
// };

// export const useTrackingTransformRestorePayload = () => {
//     return {
//         updated_by: 'JERUM_UPDATE'
//     };
// };

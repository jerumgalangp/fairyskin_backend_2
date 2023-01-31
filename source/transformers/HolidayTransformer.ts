import { HolidayDaoCreateInterface, HolidayDaoDeleteInterface, HolidayDaoRestoreInterface, HolidayDaoUpdateInterface } from 'source/interfaces/dao/HolidayDaoInterface';
import { ILike, In } from 'typeorm';
import { HolidayRouteCreateInterface, HolidayRouteInterface, HolidayRouteUpdateInterface } from '../interfaces/routes/HolidayRouteInterface';

export const useHolidayTransformPayload = (request: HolidayRouteInterface): { [column: string]: any }[] => {
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

export const useHolidayTransformCreatePayload = (userData: { id: string; table: string }, request: HolidayRouteCreateInterface): HolidayDaoCreateInterface => {
    return {
        ...request,
        created_by: userData.id
    };
};

export const useHolidayTransformUpdatePayload = (userData: { id: string; table: string }, request: HolidayRouteUpdateInterface): HolidayDaoUpdateInterface => {
    return {
        ...request,
        updated_by: userData.id
    };
};

export const useHolidayTransformDeletePayload = (userData: { id: string; table: string }): HolidayDaoDeleteInterface => {
    return {
        deleted_by: userData.id
    };
};

export const useHolidayTransformRestorePayload = (userData: { id: string; table: string }): HolidayDaoRestoreInterface => {
    return {
        updated_by: userData.id
    };
};

// export const useHolidayTransformPayload = (request: HolidayRouteInterface): any => {
//     return {
//         id: request.id
//     };
// };

// export const useHolidayTransformCreatePayload = (request: HolidayRouteCreateInterface): HolidayDaoCreateInterface => {
//     return {
//         ...request,
//         created_by: 'JERUM_CREATE',
//         created_at: new Date()
//     };
// };

// export const useHolidayTransformUpdatePayload = (request: HolidayRouteUpdateInterface): HolidayDaoUpdateInterface => {
//     return {
//         ...request,
//         updated_by: 'JERUM_UPDATE',
//         updated_at: new Date()
//     };
// };

// export const useHolidayTransformDeletePayload = () => {
//     return {
//         deleted_by: 'JERUM_DELETE',
//         deleted_at: new Date()
//     };
// };

// export const useHolidayTransformRestorePayload = () => {
//     return {
//         updated_by: 'JERUM_UPDATE'
//     };
// };

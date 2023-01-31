import { PersonnelDaoCreateInterface, PersonnelDaoDeleteInterface, PersonnelDaoRestoreInterface, PersonnelDaoUpdateInterface } from 'source/interfaces/dao/PersonnelDaoInterface';
import { ILike, In } from 'typeorm';
import { PersonnelRouteCreateInterface, PersonnelRouteInterface, PersonnelRouteUpdateInterface } from '../interfaces/routes/PersonnelRouteInterface';

export const usePersonnelTransformPayload = (request: PersonnelRouteInterface): { [column: string]: any }[] => {
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

export const usePersonnelTransformCreatePayload = (userData: { id: string; table: string }, request: PersonnelRouteCreateInterface): PersonnelDaoCreateInterface => {
    return {
        ...request,
        created_by: userData.id
    };
};

export const usePersonnelTransformUpdatePayload = (userData: { id: string; table: string }, request: PersonnelRouteUpdateInterface): PersonnelDaoUpdateInterface => {
    return {
        ...request,
        updated_by: userData.id
    };
};

export const usePersonnelTransformDeletePayload = (userData: { id: string; table: string }): PersonnelDaoDeleteInterface => {
    return {
        deleted_by: userData.id
    };
};

export const usePersonnelTransformRestorePayload = (userData: { id: string; table: string }): PersonnelDaoRestoreInterface => {
    return {
        updated_by: userData.id
    };
};

// export const usePersonnelTransformPayload = (request: PersonnelRouteInterface): any => {
//     return {
//         id: request.id
//     };
// };

// export const usePersonnelTransformCreatePayload = (request: PersonnelRouteCreateInterface): PersonnelDaoCreateInterface => {
//     return {
//         ...request,
//         created_by: 'JERUM_CREATE',
//         created_at: new Date()
//     };
// };

// export const usePersonnelTransformUpdatePayload = (request: PersonnelRouteUpdateInterface): PersonnelDaoUpdateInterface => {
//     return {
//         ...request,
//         updated_by: 'JERUM_UPDATE',
//         updated_at: new Date()
//     };
// };

// export const usePersonnelTransformDeletePayload = () => {
//     return {
//         deleted_by: 'JERUM_DELETE',
//         deleted_at: new Date()
//     };
// };

// export const usePersonnelTransformRestorePayload = () => {
//     return {
//         updated_by: 'JERUM_UPDATE'
//     };
// };

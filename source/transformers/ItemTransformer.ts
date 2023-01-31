import { ItemDaoCreateInterface, ItemDaoUpdateInterface, ItemDaoUpdateStatusInterface } from 'source/interfaces/dao/ItemDaoInterface';
import { Equal, In } from 'typeorm';
import { ItemRouteCreateInterface, ItemRouteDeleteInterface, ItemRouteInterface, ItemRouteUpdateInterface, ItemRouteUpdateStatusInterface } from '../interfaces/routes/ItemRouteInterface';

export const useItemTransformPayload = (request: ItemRouteInterface): { [column: string]: any }[] => {
    const idColumns = ['id'];
    return Object.entries(request || {})
        .reduce(
            (accum, current) => {
                const [column, value] = current;
                if (!value) return accum;
                const argValue = () => {
                    if (!idColumns.includes(column)) return Equal(`${value}`);
                    if (value.constructor === Array) return In(value);

                    return value;
                };
                return [...accum, { [column]: argValue() }];
            },
            [{}]
        )
        .filter((data) => Object.keys(data).length > 0);
};

export const useItemOptionsTransformPayload = (request: ItemRouteInterface): any => {
    return {
        buyer_id: request.buyer_id
    };
};

export const useItemTransformCreatePayload = (request: ItemRouteCreateInterface): ItemDaoCreateInterface => {
    return {
        ...request,
        created_by: 'JERUM_CREATE'
    };
};

export const useItemTransformUpdatePayload = (request: ItemRouteUpdateInterface): ItemDaoUpdateInterface => {
    return {
        ...request,
        updated_by: 'JERUM_UPDATE'
    };
};

export const useItemStatusTransformUpdatePayload = (request: ItemRouteUpdateStatusInterface): ItemDaoUpdateStatusInterface => {
    return {
        ...request,
        updated_by: 'JERUM_UPDATE'
    };
};

export const useItemTransformDeletePayload = (request: ItemRouteDeleteInterface) => {
    return {
        ...request,
        deleted_by: 'JERUM_DELETE',
        deleted_at: new Date()
    };
};

export const useItemTransformRestorePayload = () => {
    return {
        updated_by: 'JERUM_UPDATE'
    };
};

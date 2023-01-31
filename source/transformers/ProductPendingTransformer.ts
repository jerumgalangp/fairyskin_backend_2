import {
    ProductPendingDaoCreateInterface,
    ProductPendingDaoDeleteInterface,
    ProductPendingDaoRestoreInterface,
    ProductPendingDaoUpdateInterface
} from 'source/interfaces/dao/ProductPendingDaoInterface';
import { ILike, In } from 'typeorm';
import { ProductPendingRouteCreateInterface, ProductPendingRouteInterface, ProductPendingRouteUpdateInterface } from '../interfaces/routes/ProductPendingRouteInterface';
import { ProductPendingDaoApprovalInterface } from './../interfaces/dao/ProductPendingDaoInterface';
import { ProductPendingRouteApprovalInterface } from './../interfaces/routes/ProductPendingRouteInterface';

export const useProductPendingTransformPayload = (request: ProductPendingRouteInterface): { [column: string]: any }[] => {
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

export const useProductPendingTransformCreatePayload = (userData: { id: string; table: string; userName: string }, request: ProductPendingRouteCreateInterface): ProductPendingDaoCreateInterface => {
    return {
        ...request,
        request_by: userData.userName,
        event_request: 'Add',
        request_date: new Date()
    };
};

export const useProductPendingTransformUpdatePayload = (userData: { id: string; table: string; userName: string }, request: ProductPendingRouteUpdateInterface): ProductPendingDaoUpdateInterface => {
    return {
        ...request,
        request_by: userData.userName,
        event_request: 'Modify',
        request_date: new Date()
    };
};

export const useProductPendingTransformDeletePayload = (userData: { id: string; table: string; userName: string }): ProductPendingDaoDeleteInterface => {
    return {
        request_by: userData.userName,
        event_request: 'Delete',
        request_date: new Date()
    };
};

export const useProductPendingTransformApprovalPayload = (
    userData: { id: string; table: string; userName: string },
    request: ProductPendingRouteApprovalInterface
): ProductPendingDaoApprovalInterface => {
    return {
        ...request,
        request_by: userData.userName,
        event_request: request.event_request,
        request_date: new Date()
    };
};

export const useProductPendingTransformRestorePayload = (userData: { id: string; table: string; userName: string }): ProductPendingDaoRestoreInterface => {
    return {
        request_by: userData.id,
        event_request: 'Recover',
        request_date: new Date()
    };
};

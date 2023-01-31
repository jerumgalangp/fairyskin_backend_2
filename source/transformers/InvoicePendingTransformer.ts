import {
    InvoicePendingDaoCreateInterface,
    InvoicePendingDaoDeleteInterface,
    InvoicePendingDaoRestoreInterface,
    InvoicePendingDaoUpdateInterface
} from 'source/interfaces/dao/InvoicePendingDaoInterface';
import { ILike, In } from 'typeorm';
import { InvoicePendingRouteCreateInterface, InvoicePendingRouteInterface, InvoicePendingRouteUpdateInterface } from '../interfaces/routes/InvoicePendingRouteInterface';
import { InvoicePendingDaoApprovalInterface } from './../interfaces/dao/InvoicePendingDaoInterface';
import { InvoicePendingRouteApprovalInterface } from './../interfaces/routes/InvoicePendingRouteInterface';

export const useInvoicePendingTransformPayload = (request: InvoicePendingRouteInterface): { [column: string]: any }[] => {
    const idColumns = ['id'];
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

export const useInvoicePendingTransformCreatePayload = (userData: { id: string; table: string; userName: string }, request: InvoicePendingRouteCreateInterface): InvoicePendingDaoCreateInterface => {
    return {
        ...request,
        request_by: userData.userName,
        event_request: 'Add',
        request_date: new Date()
    };
};

export const useInvoicePendingTransformUpdatePayload = (userData: { id: string; table: string; userName: string }, request: InvoicePendingRouteUpdateInterface): InvoicePendingDaoUpdateInterface => {
    return {
        ...request,
        request_by: userData.userName,
        event_request: 'Modify',
        request_date: new Date()
    };
};

export const useInvoicePendingTransformDeletePayload = (userData: { id: string; table: string; userName: string }): InvoicePendingDaoDeleteInterface => {
    return {
        request_by: userData.userName,
        event_request: 'Delete',
        request_date: new Date()
    };
};

export const useInvoicePendingTransformApprovalPayload = (
    userData: { id: string; table: string; userName: string },
    request: InvoicePendingRouteApprovalInterface
): InvoicePendingDaoApprovalInterface => {
    return {
        ...request,
        request_by: userData.userName,
        event_request: request.event_request,
        request_date: new Date()
    };
};

export const useInvoicePendingTransformRestorePayload = (userData: { id: string; table: string; userName: string }): InvoicePendingDaoRestoreInterface => {
    return {
        request_by: userData.id,
        event_request: 'Recover',
        request_date: new Date()
    };
};

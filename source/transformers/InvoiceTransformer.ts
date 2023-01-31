import { InvoiceDaoCreateInterface, InvoiceDaoDeleteInterface, InvoiceDaoRestoreInterface, InvoiceDaoUpdateInterface } from 'source/interfaces/dao/InvoiceDaoInterface';
import { ILike, In } from 'typeorm';
import { InvoiceRouteCreateInterface, InvoiceRouteInterface, InvoiceRouteUpdateInterface } from '../interfaces/routes/InvoiceRouteInterface';

export const useInvoiceTransformPayload = (request: InvoiceRouteInterface): { [column: string]: any }[] => {
    const idColumns = ['invoice_code'];
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

export const useInvoiceTransformCreatePayload = (userData: { id: string; table: string }, request: InvoiceRouteCreateInterface): InvoiceDaoCreateInterface => {
    return {
        ...request,
        created_by: userData.id
    };
};

export const useInvoiceTransformUpdatePayload = (userData: { id: string; table: string }, request: InvoiceRouteUpdateInterface): InvoiceDaoUpdateInterface => {
    return {
        ...request,
        updated_by: userData.id
    };
};

export const useInvoiceTransformDeletePayload = (userData: { id: string; table: string }): InvoiceDaoDeleteInterface => {
    return {
        deleted_by: userData.id
    };
};

export const useInvoiceTransformRestorePayload = (userData: { id: string; table: string }): InvoiceDaoRestoreInterface => {
    return {
        updated_by: userData.id
    };
};

import { InvoicePendingRouteApprovalInterface, InvoicePendingRouteInterface } from './../interfaces/routes/InvoicePendingRouteInterface';
import {
    useInvoicePendingTransformApprovalPayload,
    useInvoicePendingTransformCreatePayload,
    useInvoicePendingTransformDeletePayload,
    useInvoicePendingTransformPayload,
    useInvoicePendingTransformUpdatePayload
} from './../transformers/InvoicePendingTransformer';
import {
    useInvoiceTransformCreatePayload,
    useInvoiceTransformDeletePayload,
    useInvoiceTransformPayload,
    useInvoiceTransformRestorePayload,
    useInvoiceTransformUpdatePayload
} from './../transformers/InvoiceTransformer';
import { useTransformPaginationPayload } from './../transformers/Pagination';

import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { useInvoiceDao } from '../dao/InvoiceDao';
import { HeadersRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { InvoicePendingRouteCreateInterface, InvoicePendingRouteUpdateInterface } from '../interfaces/routes/InvoicePendingRouteInterface';
import { InvoiceRouteCreateInterface, InvoiceRouteInterface, InvoiceRouteUpdateInterface } from '../interfaces/routes/InvoiceRouteInterface';

const {
    getAllInvoice: getAllInvoiceDao,
    getInvoice: getInvoiceDao,
    createInvoice: createInvoiceDao,
    updateInvoice: updateInvoiceDao,
    deleteInvoice: deleteInvoiceDao,
    getInvoicePending: getInvoicePendingDao,
    createInvoicePending: createInvoicePendingDao,
    updateInvoicePending: updateInvoicePendingDao,
    deleteInvoicePending: deleteInvoicePendingDao,
    approvalInvoicePending: approvalInvoicePendingDao,
    restoreInvoice: restoreInvoiceDao
} = useInvoiceDao();

export const useInvoiceService = () => {
    const getAllInvoice = async (request: InvoiceRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);
            const payload = useInvoiceTransformPayload(request);
            //return await getInvoiceDao(payload);
            return await getAllInvoiceDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getInvoiceDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const getInvoice = async (request: InvoiceRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);
            const payload = useInvoiceTransformPayload(request);
            //return await getInvoiceDao(payload);
            return await getInvoiceDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getInvoiceDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const createInvoice = async (InvoiceData: { id: string; table: string }, request: InvoiceRouteCreateInterface) => {
        try {
            const payload = useInvoiceTransformCreatePayload(InvoiceData, request);
            return await createInvoiceDao(payload);
        } catch (err) {
            console.log('Error Service: createInvoiceDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const updateInvoice = async (InvoiceData: { id: string; table: string }, request: InvoiceRouteUpdateInterface) => {
        try {
            const payload = useInvoiceTransformUpdatePayload(InvoiceData, request);
            return await updateInvoiceDao(request.id, payload);
        } catch (err) {
            console.log('Error Service: updateInvoice -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const deleteInvoice = async (InvoiceData: { id: string; table: string }, id: string) => {
        try {
            const payload = useInvoiceTransformDeletePayload(InvoiceData);
            return await deleteInvoiceDao(id, payload);
        } catch (err) {
            console.log('Error Service: deleteInvoiceDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const getInvoicePending = async (request: InvoicePendingRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);
            const payload = useInvoicePendingTransformPayload(request);
            //return await getInvoiceDao(payload);
            return await getInvoicePendingDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getInvoiceDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const createInvoicePending = async (InvoiceData: { id: string; table: string; userName: string }, request: InvoicePendingRouteCreateInterface) => {
        try {
            const payload = useInvoicePendingTransformCreatePayload(InvoiceData, request);
            return await createInvoicePendingDao(payload);
        } catch (err) {
            console.log('Error Service: createInvoiceDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const updateInvoicePending = async (InvoiceData: { id: string; table: string; userName: string }, request: InvoicePendingRouteUpdateInterface) => {
        try {
            const payload = useInvoicePendingTransformUpdatePayload(InvoiceData, request);
            return await updateInvoicePendingDao(request.id, payload);
        } catch (err) {
            console.log('Error Service: updateInvoice -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const deleteInvoicePending = async (InvoiceData: { id: string; table: string; userName: string }, id: string) => {
        try {
            const payload = useInvoicePendingTransformDeletePayload(InvoiceData);
            return await deleteInvoicePendingDao(id, payload);
        } catch (err) {
            console.log('Error Service: deleteInvoiceDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const approvalInvoicePending = async (InvoiceData: { id: string; table: string; userName: string }, request: InvoicePendingRouteApprovalInterface) => {
        try {
            const payload = useInvoicePendingTransformApprovalPayload(InvoiceData, request);
            return await approvalInvoicePendingDao(request.id, payload);
        } catch (err) {
            console.log('Error Service: deleteInvoiceDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const restoreInvoice = async (userData: { id: string; table: string }, id: string) => {
        try {
            const payload = useInvoiceTransformRestorePayload(userData);
            return await restoreInvoiceDao(id, payload);
        } catch (err) {
            console.log('Error Service: restoreInvoice -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    return {
        getAllInvoice,
        getInvoice,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoicePending,
        createInvoicePending,
        updateInvoicePending,
        deleteInvoicePending,
        approvalInvoicePending,
        restoreInvoice
    };
};

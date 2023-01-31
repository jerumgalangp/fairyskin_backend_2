import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { usePaymentDao } from '../dao/PaymentDao';
import { HeadersRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { PaymentRouteCreateInterface, PaymentRouteInterface, PaymentRouteUpdateInterface } from '../interfaces/routes/PaymentRouteInterface';
import { useTransformPaginationPayload } from '../transformers/Pagination';
import {
    usePaymentHistoryTransformPayload,
    usePaymentTransformCreatePayload,
    usePaymentTransformDeletePayload,
    usePaymentTransformPayload,
    usePaymentTransformRestorePayload,
    usePaymentTransformUpdatePayload
} from '../transformers/PaymentTransformer';
const {
    getPayment: getPaymentDao,
    getPaymentHistory: getPaymentHistoryDao,
    createPayment: createPaymentDao,
    updatePayment: updatePaymentDao,
    deletePayment: deletePaymentDao,
    deletePaymentHistory: deletePaymentHistoryDao,
    restorePayment: restorePaymentDao
} = usePaymentDao();

export const usePaymentService = () => {
    const getPayment = async (request: PaymentRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);

            const payload = usePaymentTransformPayload(request);
            return await getPaymentDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getPaymentDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const getPaymentHistory = async (request: PaymentRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);

            const payload = usePaymentHistoryTransformPayload(request);
            return await getPaymentHistoryDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getPaymentDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const createPayment = async (userData: { id: string; table: string }, request: PaymentRouteCreateInterface) => {
        try {
            const payload = usePaymentTransformCreatePayload(userData, request);
            return await createPaymentDao(payload);
        } catch (err) {
            console.log('Error Service: createPaymentDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const updatePayment = async (userData: { id: string; table: string }, request: PaymentRouteUpdateInterface) => {
        try {
            const payload = usePaymentTransformUpdatePayload(userData, request);
            return await updatePaymentDao(request.id, payload);
        } catch (err) {
            console.log('Error Service: updatePayment -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const deletePayment = async (userData: { id: string; table: string }, id: string) => {
        try {
            const payload = usePaymentTransformDeletePayload(userData);
            return await deletePaymentDao(id, payload);
        } catch (err) {
            console.log('Error Service: deletePaymentDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const deletePaymentHistory = async (userData: { id: string; table: string }, id: string) => {
        try {
            const payload = usePaymentTransformDeletePayload(userData);
            return await deletePaymentHistoryDao(id, payload);
        } catch (err) {
            console.log('Error Service: deletePaymentDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const restorePayment = async (userData: { id: string; table: string }, id: string) => {
        try {
            const payload = usePaymentTransformRestorePayload(userData);
            return await restorePaymentDao(id, payload);
        } catch (err) {
            console.log('Error Service: restorePayment -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    return {
        getPayment,
        getPaymentHistory,
        createPayment,
        updatePayment,
        deletePayment,
        deletePaymentHistory,
        restorePayment
    };
};

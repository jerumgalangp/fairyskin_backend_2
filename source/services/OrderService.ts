import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { useOrderDao } from '../dao/OrderDao';
import { HeadersRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { OrderRouteCreateInterface, OrderRouteInterface, OrderRouteUpdateInterface } from '../interfaces/routes/OrderRouteInterface';
import {
    useOrderDeliveryTransformPayload,
    useOrderProductTransformPayload,
    useOrderTransformCreatePayload,
    useOrderTransformDeletePayload,
    useOrderTransformPayload,
    useOrderTransformRestorePayload,
    useOrderTransformUpdatePayload
} from '../transformers/OrderTransformer';
import { OrderDeliveryPendingRouteApprovalInterface, OrderDeliveryPendingRouteInterface, OrderDeliveryPendingRouteUpdateInterface } from './../interfaces/routes/OrderDeliveryPendingRouteInterface';
import { useOrderDeliveryPendingTransformPayload } from './../transformers/OrderDeliveryPendingTransformer';
import { useOrderDeliverProductTransformPayload } from './../transformers/OrderTransformer';

import { useOrderDeliveryPendingTransformApprovalPayload, useOrderDeliveryPendingTransformUpdatePayload } from '../transformers/OrderDeliveryPendingTransformer';

import { useTransformPaginationPayload } from '../transformers/Pagination';
const {
    getOrder: getOrderDao,
    getOrderDelivery: getOrderDeliveryDao,
    getOrderDeliveryPending: getOrderDeliveryPendingDao,
    getOrderProduct: getOrderProductDao,
    getOrderDeliveredProduct: getOrderDeliveredProductDao,
    getOrderDeliveryProduct: getOrderDeliveryProductDao,
    createOrder: createOrderDao,
    updateOrder: updateOrderDao,
    updateOrderDeliveryPending: updateOrderDeliveryPendingDao,
    approvalOrderDeliveryPending: approvalOrderDeliveryPendingDao,
    deleteOrder: deleteOrderDao,
    restoreOrder: restoreOrderDao,
    getOrderReport: getOrderReportDao
} = useOrderDao();

export const useOrderService = () => {
    const getOrder = async (request: OrderRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);
            let from_report = request!.from_report as string;

            if (from_report !== undefined) {
                return await getOrderReportDao(request);
            } else {
                const payload = useOrderTransformPayload(request);
                return await getOrderDao(payload, transformedPagination, headers);
            }
        } catch (err) {
            console.log('Error Service: getOrderService -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const getOrderDelivery = async (request: OrderRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);
            let from_report = request!.from_report as string;

            if (from_report !== undefined) {
                return await getOrderReportDao(request);
            } else {
                const payload = useOrderDeliveryTransformPayload(request);
                return await getOrderDeliveryDao(payload, transformedPagination, headers);
            }
        } catch (err) {
            console.log('Error Service: getOrderDeliveryService -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const getOrderDeliveryPending = async (request: OrderDeliveryPendingRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);
            const payload = useOrderDeliveryPendingTransformPayload(request);
            return await getOrderDeliveryPendingDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getOrderDeliveryPendingService -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const getOrderProduct = async (request: OrderRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);

            const payload = useOrderProductTransformPayload(request);
            return await getOrderProductDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getOrderProductService -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };
    const getOrderDeliveredProduct = async (request: OrderRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);

            const payload = useOrderProductTransformPayload(request);
            return await getOrderDeliveredProductDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getOrderDeliveredProductService -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const getOrderDeliveryProduct = async (request: OrderRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);

            const payload = useOrderDeliverProductTransformPayload(request);
            return await getOrderDeliveryProductDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getOrderDeliveryProduct -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const createOrder = async (userData: { id: string; table: string }, request: OrderRouteCreateInterface) => {
        try {
            const payload = useOrderTransformCreatePayload(userData, request);
            return await createOrderDao(payload);
        } catch (err) {
            console.log('Error Service: createOrderDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const updateOrder = async (userData: { id: string; table: string }, request: OrderRouteUpdateInterface) => {
        try {
            const payload = useOrderTransformUpdatePayload(userData, request);
            return await updateOrderDao(request.id, payload);
        } catch (err) {
            console.log('Error Service: updateOrder -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const updateOrderDeliveryPending = async (data: { id: string; table: string; userName: string }, request: OrderDeliveryPendingRouteUpdateInterface) => {
        try {
            const payload = useOrderDeliveryPendingTransformUpdatePayload(data, request);
            return await updateOrderDeliveryPendingDao(request.id, payload);
        } catch (err) {
            console.log('Error Service: update order deliver pending -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const approvalOrderDeliveryPending = async (data: { id: string; table: string; userName: string }, request: OrderDeliveryPendingRouteApprovalInterface) => {
        try {
            const payload = useOrderDeliveryPendingTransformApprovalPayload(data, request);
            return await approvalOrderDeliveryPendingDao(request.id, payload);
        } catch (err) {
            console.log('Error Service: approval order deliver pending -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const deleteOrder = async (userData: { id: string; table: string }, id: string) => {
        try {
            const payload = useOrderTransformDeletePayload(userData);
            return await deleteOrderDao(id, payload);
        } catch (err) {
            console.log('Error Service: deleteOrderDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const restoreOrder = async (userData: { id: string; table: string }, id: string) => {
        try {
            const payload = useOrderTransformRestorePayload(userData);
            return await restoreOrderDao(id, payload);
        } catch (err) {
            console.log('Error Service: restoreOrder -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    return {
        getOrder,
        getOrderDelivery,
        getOrderDeliveryPending,
        getOrderProduct,
        getOrderDeliveredProduct,
        getOrderDeliveryProduct,
        createOrder,
        updateOrder,
        updateOrderDeliveryPending,
        approvalOrderDeliveryPending,
        deleteOrder,
        restoreOrder
    };
};

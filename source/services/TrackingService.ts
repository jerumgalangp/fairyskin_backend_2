import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { useTrackingDao } from '../dao/TrackingDao';
import { HeadersRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { TrackingRouteCreateInterface, TrackingRouteInterface, TrackingRouteUpdateInterface } from '../interfaces/routes/TrackingRouteInterface';
import {
    useOrderTrackingTransformPayload,
    useTrackingTransformCreatePayload,
    useTrackingTransformDeletePayload,
    useTrackingTransformPayload,
    useTrackingTransformRestorePayload,
    useTrackingTransformUpdatePayload
} from '../transformers/TrackingTransformer';
import { OrderRouteInterface } from './../interfaces/routes/OrderRouteInterface';
import { useOrderDistributedTransformPayload } from './../transformers/TrackingTransformer';

import { useTransformPaginationPayload } from '../transformers/Pagination';
const {
    getOrdersForTracking: getOrdersForTrackingDao,
    getTracking: getTrackingDao,
    getOrderDistributed: getOrderDistributedDao,
    createTracking: createTrackingDao,
    updateTracking: updateTrackingDao,
    deleteTracking: deleteTrackingDao,
    restoreTracking: restoreTrackingDao
} = useTrackingDao();

export const useTrackingService = () => {
    const getOrdersForTracking = async (request: OrderRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);

            const payload = useOrderTrackingTransformPayload(request);
            return await getOrdersForTrackingDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getOrderService -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };
    const getTracking = async (request: TrackingRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);
            //let from_report = request!.from_report as string;

            // if (from_report !== undefined) {
            //     return await getTrackingReportDao(request);
            // } else {
            const payload = useTrackingTransformPayload(request);
            return await getTrackingDao(payload, transformedPagination, headers);
            //}
        } catch (err) {
            console.log('Error Service: getTrackingService -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const getOrderDistributed = async (request: OrderRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);

            const payload = useOrderDistributedTransformPayload(request);
            return await getOrderDistributedDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getOrderDistributedDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const createTracking = async (userData: { id: string; table: string }, request: TrackingRouteCreateInterface) => {
        try {
            const payload = useTrackingTransformCreatePayload(userData, request);
            return await createTrackingDao(payload);
        } catch (err) {
            console.log('Error Service: createTrackingDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const updateTracking = async (userData: { id: string; table: string }, request: TrackingRouteUpdateInterface) => {
        try {
            const payload = useTrackingTransformUpdatePayload(userData, request);
            return await updateTrackingDao(request.id, payload);
        } catch (err) {
            console.log('Error Service: updateTracking -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const deleteTracking = async (userData: { id: string; table: string }, id: string) => {
        try {
            const payload = useTrackingTransformDeletePayload(userData);
            return await deleteTrackingDao(id, payload);
        } catch (err) {
            console.log('Error Service: deleteTrackingDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const restoreTracking = async (userData: { id: string; table: string }, id: string) => {
        try {
            const payload = useTrackingTransformRestorePayload(userData);
            return await restoreTrackingDao(id, payload);
        } catch (err) {
            console.log('Error Service: restoreTracking -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    return {
        getOrdersForTracking,
        getTracking,
        getOrderDistributed,
        createTracking,
        updateTracking,
        deleteTracking,
        restoreTracking
    };
};

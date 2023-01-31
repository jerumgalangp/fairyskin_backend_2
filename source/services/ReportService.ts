import { useTransformPaginationPayload } from './../transformers/Pagination';

import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { useReportDao } from '../dao/ReportDao';
import { HeadersRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { ReportRouteInterface } from '../interfaces/routes/ReportRouteInterface';
import { useReportTransformPayload } from '../transformers/ReportTransformer';

const { getQSPR: getQSPRDao, getTSPR: getTSPRDao, getPPR: getPPRDao } = useReportDao();

export const useReportService = () => {
    const getQSPR = async (request: ReportRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);
            const payload = useReportTransformPayload(request);
            //return await getAreaDao(payload);
            return await getQSPRDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getAreaDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const getTSPR = async (request: ReportRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);
            const payload = useReportTransformPayload(request);
            //return await getAreaDao(payload);
            return await getTSPRDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getAreaDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const getPPR = async (request: ReportRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);
            const payload = useReportTransformPayload(request);
            //return await getAreaDao(payload);
            return await getPPRDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getAreaDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    return {
        getQSPR,
        getTSPR,
        getPPR
    };
};

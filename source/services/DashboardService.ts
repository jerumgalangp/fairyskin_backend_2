import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { useDashboardDao } from '../dao/DashboardDao';
import { DashboardRouteInterface } from '../interfaces/routes/DashboardRouteInterface';
import { HeadersRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { useDashboardTransform } from './../transformers/DashboardTransformer';
const { getDashboardSalesPerTransaction: getDashboardSalesPerTransactionDao } = useDashboardDao();

export const useDashboardService = () => {
    const getDashboardSalesPerTransaction = async (request: DashboardRouteInterface, _headers: HeadersRouteInterface) => {
        try {
            //const transformedPagination = useTransformPaginationPayload(headers);
            const payload = useDashboardTransform(request);
            return await getDashboardSalesPerTransactionDao(payload);
        } catch (err) {
            console.log('Error Service: getDashboardSalesPerTransactionService -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    return {
        getDashboardSalesPerTransaction
    };
};

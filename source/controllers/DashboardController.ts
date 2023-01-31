import { Request, Response } from 'express';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { DashboardRouteInterface } from '../interfaces/routes/DashboardRouteInterface';
import { HeadersRouteInterface, HttpResponseRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { useDashboardService } from '../services/DashboardService';

const { getDashboardSalesPerTransaction: getDashboardSalesPerTransactionService } = useDashboardService();

export const useDashboardController = () => {
    const getDashboardSalesPerTransaction = async (req: Request, res: Response) => {
        try {
            const request: DashboardRouteInterface = req.query;

            const userId = req.userId;
            //const userTable = req.userTable;
            let response: HttpResponseRouteInterface;
            if (!userId) {
                response = {
                    ...HTTP_RESPONSES[HttpResponseType.ServerError],
                    message: 'User is not authorized to access this api.'
                };
                res.status(response.statusCode).json(response);
            } else {
                const headers = req.headers as HeadersRouteInterface;
                const response: HttpResponseRouteInterface = await getDashboardSalesPerTransactionService(request, headers);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: getDashboardTotalCountService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    return {
        getDashboardSalesPerTransaction
    };
};

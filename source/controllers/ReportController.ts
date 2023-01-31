import { Request, Response } from 'express';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { HeadersRouteInterface, HttpResponseRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { ReportRouteInterface } from '../interfaces/routes/ReportRouteInterface';
import { useReportService } from '../services/ReportService';

const { getQSPR: getQSPRService, getTSPR: getTSPRService, getPPR: getPPRService } = useReportService();

export const useReportController = () => {
    const getQSPR = async (req: Request, res: Response) => {
        try {
            const request: ReportRouteInterface = req.query;
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
                const response: HttpResponseRouteInterface = await getQSPRService(request, headers);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: getAreaService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const getTSPR = async (req: Request, res: Response) => {
        try {
            const request: ReportRouteInterface = req.query;
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
                const response: HttpResponseRouteInterface = await getTSPRService(request, headers);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: getAreaService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const getPPR = async (req: Request, res: Response) => {
        try {
            const request: ReportRouteInterface = req.query;
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
                const response: HttpResponseRouteInterface = await getPPRService(request, headers);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: getAreaService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    return {
        getQSPR,
        getTSPR,
        getPPR
    };
};

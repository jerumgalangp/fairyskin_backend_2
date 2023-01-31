import { Request, Response } from 'express';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { HeadersRouteInterface, HttpResponseRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { TrackingRouteCreateInterface, TrackingRouteInterface, TrackingRouteUpdateInterface } from '../interfaces/routes/TrackingRouteInterface';
import { useTrackingService } from '../services/TrackingService';
import { OrderRouteInterface } from './../interfaces/routes/OrderRouteInterface';

const {
    getOrdersForTracking: getOrdersForTrackingService,
    getTracking: getTrackingService,
    getOrderDistributed: getOrderDistributedService,
    createTracking: createTrackingService,
    updateTracking: updateTrackingService,
    deleteTracking: deleteTrackingService,
    restoreTracking: restoreTrackingService
} = useTrackingService();

export const useTrackingController = () => {
    const getOrdersForTracking = async (req: Request, res: Response) => {
        try {
            const request: OrderRouteInterface = req.query;
            const headers = req.headers as HeadersRouteInterface;
            const response: HttpResponseRouteInterface = await getOrdersForTrackingService(request, headers);
            res.status(response.statusCode).json(response);
        } catch (err) {
            console.log('Error Controller: getOrderService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const getTracking = async (req: Request, res: Response) => {
        try {
            const request: TrackingRouteInterface = req.query;
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
                const response: HttpResponseRouteInterface = await getTrackingService(request, headers);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: getTrackingService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const getOrderDistributed = async (req: Request, res: Response) => {
        try {
            const request: TrackingRouteInterface = req.query;
            const headers = req.headers as HeadersRouteInterface;
            const response: HttpResponseRouteInterface = await getOrderDistributedService(request, headers);
            res.status(response.statusCode).json(response);
        } catch (err) {
            console.log('Error Controller: getOrderDistributedService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const createTracking = async (req: Request, res: Response) => {
        try {
            const request: TrackingRouteCreateInterface = req.body;
            const userId = req.userId;
            const userTable = req.userTable;
            let response: HttpResponseRouteInterface;

            if (!userId) {
                response = {
                    ...HTTP_RESPONSES[HttpResponseType.ServerError],
                    message: 'User is not authorized to access this api.'
                };
                res.status(response.statusCode).json(response);
            } else {
                const userData = { id: userId, table: userTable };
                response = await createTrackingService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: createTrackingService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const updateTracking = async (req: Request, res: Response) => {
        try {
            const request: TrackingRouteUpdateInterface = req.body;
            const userId = req.userId;
            const userTable = req.userTable;
            let response: HttpResponseRouteInterface;

            if (!userId) {
                response = {
                    ...HTTP_RESPONSES[HttpResponseType.ServerError],
                    message: 'User is not authorized to access this api.'
                };
                res.status(response.statusCode).json(response);
            } else {
                const userData = { id: userId, table: userTable };
                response = await updateTrackingService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: updateTrackingService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const deleteTracking = async (req: Request, res: Response) => {
        try {
            const id = req.query.id as string;
            let response: HttpResponseRouteInterface;
            const userId = req.userId;
            const userTable = req.userTable;

            if (!userId) {
                response = {
                    ...HTTP_RESPONSES[HttpResponseType.ServerError],
                    message: 'User is not authorized to access this api.'
                };
                res.status(response.statusCode).json(response);
            } else {
                const userData = { id: userId, table: userTable };
                response = await deleteTrackingService(userData, id);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: deleteTrackingService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const restoreTracking = async (req: Request, res: Response) => {
        try {
            const id = req.query.id as string;
            const userId = req.userId;
            const userTable = req.userTable;
            let response: HttpResponseRouteInterface;

            if (!userId || !userTable) {
                response = {
                    ...HTTP_RESPONSES[HttpResponseType.ServerError],
                    message: 'User is not authorized to access this api.'
                };
                res.status(response.statusCode).json(response);
            } else {
                const userData = { id: userId, table: userTable };
                response = await restoreTrackingService(userData, id);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: restoreTrackingService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
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

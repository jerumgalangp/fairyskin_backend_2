import { Request, Response } from 'express';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { HeadersRouteInterface, HttpResponseRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { ParameterRouteCreateInterface, ParameterRouteInterface, ParameterRouteUpdateInterface } from '../interfaces/routes/ParameterRouteInterface';
import { useParameterService } from '../services/ParameterService';

const {
    getParameter: getParameterService,
    createParameter: createParameterService,
    updateParameter: updateParameterService,
    deleteParameter: deleteParameterService,
    restoreParameter: restoreParameterService
} = useParameterService();

export const useParameterController = () => {
    const getParameter = async (req: Request, res: Response) => {
        try {
            const request: ParameterRouteInterface = req.query;
            const userId = req.userId;
            const userTable = req.userTable;
            console.log('-----------------');
            console.log(userId);
            console.log(userTable);
            console.log('-----------------');
            const headers = req.headers as HeadersRouteInterface;
            const response: HttpResponseRouteInterface = await getParameterService(request, headers);
            res.status(response.statusCode).json(response);
        } catch (err) {
            console.log('Error Controller: getParameterService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const createParameter = async (req: Request, res: Response) => {
        try {
            const request: ParameterRouteCreateInterface = req.body;
            const userId = req.userId;
            const userTable = req.userTable;
            let response: HttpResponseRouteInterface;

            console.log('---------------------');
            console.log(userId);
            console.log(userTable);
            console.log('---------------------');

            if (!userId) {
                response = {
                    ...HTTP_RESPONSES[HttpResponseType.ServerError],
                    message: 'User is not authorized to access this api.'
                };
                res.status(response.statusCode).json(response);
            } else {
                const userData = { id: userId, table: userTable };
                response = await createParameterService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: createParameterService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const updateParameter = async (req: Request, res: Response) => {
        try {
            const request: ParameterRouteUpdateInterface = req.body;
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
                response = await updateParameterService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: updateParameterService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const deleteParameter = async (req: Request, res: Response) => {
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
                response = await deleteParameterService(userData, id);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: deleteParameterService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const restoreParameter = async (req: Request, res: Response) => {
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
                response = await restoreParameterService(userData, id);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: restoreParameterService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    return {
        getParameter,
        createParameter,
        updateParameter,
        deleteParameter,
        restoreParameter
    };
};

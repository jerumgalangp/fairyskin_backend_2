import { Request, Response } from 'express';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { CustomerRouteCreateInterface, CustomerRouteInterface, CustomerRouteUpdateInterface } from '../interfaces/routes/CustomerRouteInterface';
import { HeadersRouteInterface, HttpResponseRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { useCustomerService } from '../services/CustomerService';

const {
    getCustomer: getCustomerService,
    createCustomer: createCustomerService,
    updateCustomer: updateCustomerService,
    deleteCustomer: deleteCustomerService,
    restoreCustomer: restoreCustomerService
} = useCustomerService();

export const useCustomerController = () => {
    const getCustomer = async (req: Request, res: Response) => {
        try {
            const request: CustomerRouteInterface = req.query;
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
                const response: HttpResponseRouteInterface = await getCustomerService(request, headers);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: getCustomerService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const createCustomer = async (req: Request, res: Response) => {
        try {
            const request: CustomerRouteCreateInterface = req.body;
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
                response = await createCustomerService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: createCustomerService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const updateCustomer = async (req: Request, res: Response) => {
        try {
            const request: CustomerRouteUpdateInterface = req.body;
            const userId = req.userId;
            const userTable = req.userTable;
            let response: HttpResponseRouteInterface;

            // console.log('-------------------------');
            // console.log(request);
            // console.log(userId);
            // console.log('-------------------------');

            if (!userId) {
                response = {
                    ...HTTP_RESPONSES[HttpResponseType.ServerError],
                    message: 'User is not authorized to access this api.'
                };
                res.status(response.statusCode).json(response);
            } else {
                const userData = { id: userId, table: userTable };
                response = await updateCustomerService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: updateCustomerService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const deleteCustomer = async (req: Request, res: Response) => {
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
                response = await deleteCustomerService(userData, id);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: deleteCustomerService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const restoreCustomer = async (req: Request, res: Response) => {
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
                response = await restoreCustomerService(userData, id);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: restoreCustomerService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    return {
        getCustomer,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        restoreCustomer
    };
};

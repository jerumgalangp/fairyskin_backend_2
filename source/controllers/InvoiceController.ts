import { Request, Response } from 'express';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { HeadersRouteInterface, HttpResponseRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { InvoiceRouteCreateInterface, InvoiceRouteInterface, InvoiceRouteUpdateInterface } from '../interfaces/routes/InvoiceRouteInterface';
import { useInvoiceService } from '../services/InvoiceService';
import { InvoicePendingRouteApprovalInterface, InvoicePendingRouteCreateInterface, InvoicePendingRouteUpdateInterface } from './../interfaces/routes/InvoicePendingRouteInterface';

const {
    getAllInvoice: getAllInvoiceService,
    getInvoice: getInvoiceService,
    createInvoice: createInvoiceService,
    updateInvoice: updateInvoiceService,
    deleteInvoice: deleteInvoiceService,
    getInvoicePending: getInvoicePendingService,
    createInvoicePending: createInvoicePendingService,
    updateInvoicePending: updateInvoicePendingService,
    deleteInvoicePending: deleteInvoicePendingService,
    approvalInvoicePending: approvalInvoicePendingService,
    restoreInvoice: restoreInvoiceService
} = useInvoiceService();

export const useInvoiceController = () => {
    const getAllInvoice = async (req: Request, res: Response) => {
        try {
            const request: InvoiceRouteInterface = req.query;
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
                const response: HttpResponseRouteInterface = await getAllInvoiceService(request, headers);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: getInvoiceService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const getInvoice = async (req: Request, res: Response) => {
        try {
            const request: InvoiceRouteInterface = req.query;
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
                const response: HttpResponseRouteInterface = await getInvoiceService(request, headers);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: getInvoiceService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const createInvoice = async (req: Request, res: Response) => {
        try {
            const request: InvoiceRouteCreateInterface = req.body;
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
                response = await createInvoiceService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: createInvoiceService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const updateInvoice = async (req: Request, res: Response) => {
        try {
            const request: InvoiceRouteUpdateInterface = req.body;
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
                response = await updateInvoiceService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: updateInvoiceService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const deleteInvoice = async (req: Request, res: Response) => {
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
                response = await deleteInvoiceService(userData, id);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: deleteInvoiceService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const getInvoicePending = async (req: Request, res: Response) => {
        try {
            const request: InvoiceRouteInterface = req.query;
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
                const response: HttpResponseRouteInterface = await getInvoicePendingService(request, headers);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: getInvoiceService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const createInvoicePending = async (req: Request, res: Response) => {
        try {
            const request: InvoicePendingRouteCreateInterface = req.body;
            const userId = req.userId;
            const userTable = req.userTable;
            const userName = req.userName;
            let response: HttpResponseRouteInterface;

            if (!userId) {
                response = {
                    ...HTTP_RESPONSES[HttpResponseType.ServerError],
                    message: 'User is not authorized to access this api.'
                };
                res.status(response.statusCode).json(response);
            } else {
                const userData = { id: userId, table: userTable, userName: userName };
                response = await createInvoicePendingService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: createInvoiceService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const updateInvoicePending = async (req: Request, res: Response) => {
        try {
            const request: InvoicePendingRouteUpdateInterface = req.body;
            const userId = req.userId;
            const userTable = req.userTable;
            const userName = req.userName;
            let response: HttpResponseRouteInterface;

            if (!userId) {
                response = {
                    ...HTTP_RESPONSES[HttpResponseType.ServerError],
                    message: 'User is not authorized to access this api.'
                };
                res.status(response.statusCode).json(response);
            } else {
                const userData = { id: userId, table: userTable, userName: userName };
                response = await updateInvoicePendingService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: updateInvoiceService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const deleteInvoicePending = async (req: Request, res: Response) => {
        try {
            const id = req.query.id as string;
            let response: HttpResponseRouteInterface;
            const userId = req.userId;
            const userTable = req.userTable;
            const userName = req.userName;
            if (!userId) {
                response = {
                    ...HTTP_RESPONSES[HttpResponseType.ServerError],
                    message: 'User is not authorized to access this api.'
                };
                res.status(response.statusCode).json(response);
            } else {
                const userData = { id: userId, table: userTable, userName: userName };
                response = await deleteInvoicePendingService(userData, id);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: deleteInvoiceService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const approvalInvoicePending = async (req: Request, res: Response) => {
        try {
            //const id = req.query.id as string;
            const request: InvoicePendingRouteApprovalInterface = req.body;
            let response: HttpResponseRouteInterface;
            const userId = req.userId;
            const userTable = req.userTable;
            const userName = req.userName;

            if (!userId) {
                response = {
                    ...HTTP_RESPONSES[HttpResponseType.ServerError],
                    message: 'User is not authorized to access this api.'
                };
                res.status(response.statusCode).json(response);
            } else {
                const userData = { id: userId, table: userTable, userName: userName };
                response = await approvalInvoicePendingService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: rejectInvoicePending -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const restoreInvoice = async (req: Request, res: Response) => {
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
                response = await restoreInvoiceService(userData, id);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: restoreInvoiceService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    return {
        getAllInvoice,
        getInvoice,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoicePending,
        createInvoicePending,
        updateInvoicePending,
        deleteInvoicePending,
        approvalInvoicePending,
        restoreInvoice
    };
};

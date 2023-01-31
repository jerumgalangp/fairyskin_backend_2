import { Request, Response } from 'express';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { HeadersRouteInterface, HttpResponseRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { OrderRouteCreateInterface, OrderRouteInterface, OrderRouteUpdateInterface } from '../interfaces/routes/OrderRouteInterface';
import { useOrderService } from '../services/OrderService';
import { OrderDeliveryPendingRouteApprovalInterface, OrderDeliveryPendingRouteInterface, OrderDeliveryPendingRouteUpdateInterface } from './../interfaces/routes/OrderDeliveryPendingRouteInterface';

const {
    getOrder: getOrderService,
    getOrderDelivery: getOrderDeliveryService,
    getOrderDeliveryPending: getOrderDeliveryPendingService,
    getOrderProduct: getOrderProductService,
    getOrderDeliveredProduct: getOrderDeliveredProductService,
    getOrderDeliveryProduct: getOrderDeliveryProductService,
    createOrder: createOrderService,
    updateOrder: updateOrderService,
    updateOrderDeliveryPending: updateOrderDeliveryPendingService,
    approvalOrderDeliveryPending: approvalOrderDeliveryService,
    deleteOrder: deleteOrderService,
    restoreOrder: restoreOrderService
} = useOrderService();

export const useOrderController = () => {
    const getOrder = async (req: Request, res: Response) => {
        try {
            const request: OrderRouteInterface = req.query;
            const headers = req.headers as HeadersRouteInterface;
            const response: HttpResponseRouteInterface = await getOrderService(request, headers);
            res.status(response.statusCode).json(response);
        } catch (err) {
            console.log('Error Controller: getOrderService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const getOrderDelivery = async (req: Request, res: Response) => {
        try {
            const request: OrderRouteInterface = req.query;
            const headers = req.headers as HeadersRouteInterface;
            const response: HttpResponseRouteInterface = await getOrderDeliveryService(request, headers);
            res.status(response.statusCode).json(response);
        } catch (err) {
            console.log('Error Controller: getOrderDeliveryService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const getOrderDeliveryPending = async (req: Request, res: Response) => {
        try {
            const request: OrderDeliveryPendingRouteInterface = req.query;
            const headers = req.headers as HeadersRouteInterface;
            const response: HttpResponseRouteInterface = await getOrderDeliveryPendingService(request, headers);
            res.status(response.statusCode).json(response);
        } catch (err) {
            console.log('Error Controller: getOrderDeliveryPendingService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const getOrderProduct = async (req: Request, res: Response) => {
        try {
            const request: OrderRouteInterface = req.query;
            const headers = req.headers as HeadersRouteInterface;
            const response: HttpResponseRouteInterface = await getOrderProductService(request, headers);
            res.status(response.statusCode).json(response);
        } catch (err) {
            console.log('Error Controller: getOrderProductService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const getOrderDeliveredProduct = async (req: Request, res: Response) => {
        try {
            const request: OrderRouteInterface = req.query;
            const headers = req.headers as HeadersRouteInterface;
            const response: HttpResponseRouteInterface = await getOrderDeliveredProductService(request, headers);
            res.status(response.statusCode).json(response);
        } catch (err) {
            console.log('Error Controller: getOrderDeliveredProduct -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const getOrderDeliveryProduct = async (req: Request, res: Response) => {
        try {
            const request: OrderRouteInterface = req.query;
            const headers = req.headers as HeadersRouteInterface;
            const response: HttpResponseRouteInterface = await getOrderDeliveryProductService(request, headers);
            res.status(response.statusCode).json(response);
        } catch (err) {
            console.log('Error Controller: getOrderDeliveryProductService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const createOrder = async (req: Request, res: Response) => {
        try {
            const request: OrderRouteCreateInterface = req.body;
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
                response = await createOrderService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: createOrderService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const createOrderFile = async (req: Request, res: Response) => {
        try {
            const request: OrderRouteCreateInterface = req.body;
            const userId = req.userId;
            const userTable = req.userTable;
            let response: HttpResponseRouteInterface;

            console.log('----------order-------controller-=-----------');
            console.log(req.body);
            console.log('----------order-------controller-=-----------');

            if (!userId) {
                response = {
                    ...HTTP_RESPONSES[HttpResponseType.ServerError],
                    message: 'User is not authorized to access this api.'
                };
                res.status(response.statusCode).json(response);
            } else {
                const userData = { id: userId, table: userTable };
                response = await createOrderService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: createItemService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const updateOrder = async (req: Request, res: Response) => {
        try {
            const request: OrderRouteUpdateInterface = req.body;
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
                response = await updateOrderService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: updateOrderService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const updateOrderFile = async (req: Request, res: Response) => {
        try {
            const request: OrderRouteUpdateInterface = req.body;
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
                response = await updateOrderService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: updateOrderService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const updateOrderDeliveryPending = async (req: Request, res: Response) => {
        try {
            const request: OrderDeliveryPendingRouteUpdateInterface = req.body;
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
                response = await updateOrderDeliveryPendingService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: updateInvoiceService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const approvalOrderDeliveryPending = async (req: Request, res: Response) => {
        try {
            //const id = req.query.id as string;
            const request: OrderDeliveryPendingRouteApprovalInterface = req.body;
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
                response = await approvalOrderDeliveryService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: rejectInvoicePending -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const deleteOrder = async (req: Request, res: Response) => {
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
                response = await deleteOrderService(userData, id);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: deleteOrderService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const restoreOrder = async (req: Request, res: Response) => {
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
                response = await restoreOrderService(userData, id);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: restoreOrderService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
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
        createOrderFile,
        updateOrder,
        updateOrderDeliveryPending,
        approvalOrderDeliveryPending,
        updateOrderFile,
        deleteOrder,
        restoreOrder
    };
};

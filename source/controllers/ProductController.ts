import { Request, Response } from 'express';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { HeadersRouteInterface, HttpResponseRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { ProductRouteCreateInterface, ProductRouteInterface, ProductRouteUpdateInterface } from '../interfaces/routes/ProductRouteInterface';
import { useProductService } from '../services/ProductService';
import { ProductPendingRouteApprovalInterface, ProductPendingRouteCreateInterface, ProductPendingRouteUpdateInterface } from './../interfaces/routes/ProductPendingRouteInterface';

const {
    getAllProduct: getAllProductService,
    getProduct: getProductService,
    createProduct: createProductService,
    updateProduct: updateProductService,
    deleteProduct: deleteProductService,
    getProductPending: getProductPendingService,
    createProductPending: createProductPendingService,
    updateProductPending: updateProductPendingService,
    deleteProductPending: deleteProductPendingService,
    approvalProductPending: approvalProductPendingService,
    restoreProduct: restoreProductService
} = useProductService();

export const useProductController = () => {
    const getAllProduct = async (req: Request, res: Response) => {
        try {
            const request: ProductRouteInterface = req.query;
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
                const response: HttpResponseRouteInterface = await getAllProductService(request, headers);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: getProductService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const getProduct = async (req: Request, res: Response) => {
        try {
            const request: ProductRouteInterface = req.query;
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
                const response: HttpResponseRouteInterface = await getProductService(request, headers);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: getProductService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const createProduct = async (req: Request, res: Response) => {
        try {
            const request: ProductRouteCreateInterface = req.body;
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
                response = await createProductService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: createProductService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const updateProduct = async (req: Request, res: Response) => {
        try {
            const request: ProductRouteUpdateInterface = req.body;
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
                response = await updateProductService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: updateProductService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const deleteProduct = async (req: Request, res: Response) => {
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
                response = await deleteProductService(userData, id);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: deleteProductService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const getProductPending = async (req: Request, res: Response) => {
        try {
            const request: ProductRouteInterface = req.query;
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
                const response: HttpResponseRouteInterface = await getProductPendingService(request, headers);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: getProductService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const createProductPending = async (req: Request, res: Response) => {
        try {
            const request: ProductPendingRouteCreateInterface = req.body;
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
                response = await createProductPendingService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: createProductService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const updateProductPending = async (req: Request, res: Response) => {
        try {
            const request: ProductPendingRouteUpdateInterface = req.body;
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
                response = await updateProductPendingService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: updateProductService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const deleteProductPending = async (req: Request, res: Response) => {
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
                response = await deleteProductPendingService(userData, id);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: deleteProductService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const approvalProductPending = async (req: Request, res: Response) => {
        try {
            //const id = req.query.id as string;
            const request: ProductPendingRouteApprovalInterface = req.body;
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
                response = await approvalProductPendingService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: rejectProductPending -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const restoreProduct = async (req: Request, res: Response) => {
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
                response = await restoreProductService(userData, id);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            console.log('Error Controller: restoreProductService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    return {
        getAllProduct,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        getProductPending,
        createProductPending,
        updateProductPending,
        deleteProductPending,
        approvalProductPending,
        restoreProduct
    };
};

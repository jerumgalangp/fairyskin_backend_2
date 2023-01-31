import { Request, Response } from 'express';
import Logger from '../common/logger/winston.logger';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { HeadersRouteInterface, HttpResponseRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { UserRouteCreateInterface, UserRouteInterface, UserRouteResetPasswordInterface, UserRouteUpdateInterface } from '../interfaces/routes/UserRouteInterface';
import { useUserService } from '../services/UserService';

const {
    getUser: getUserService,
    getUserByID: getUserByIDService,
    createUser: createUserService,
    updateUser: updateUserService,
    deleteUser: deleteUserService,
    resetUserPassword: resetUserPasswordService
} = useUserService();

export const useUserController = () => {
    const getUser = async (req: Request, res: Response) => {
        try {
            const request: UserRouteInterface = req.query;
            const headers = req.headers as HeadersRouteInterface;
            const response: HttpResponseRouteInterface = await getUserService(request, headers);
            res.status(response.statusCode).json(response);
        } catch (err) {
            Logger.error('Error Controller: getUserService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const getUserByID = async (req: Request, res: Response) => {
        try {
            const request: UserRouteInterface = req.query;
            // Logger.info('----------getUser---------------');
            // Logger.info(JSON.stringify(request));
            // Logger.info('------------getUser-------------');
            const headers = req.headers as HeadersRouteInterface;
            const response: HttpResponseRouteInterface = await getUserByIDService(request, headers);
            res.status(response.statusCode).json(response);
        } catch (err) {
            Logger.error('Error Controller: getUserByIDService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const createUser = async (req: Request, res: Response) => {
        try {
            const request: UserRouteCreateInterface = req.body;
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
                response = await createUserService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            Logger.error('Error Controller: createUserService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const updateUser = async (req: Request, res: Response) => {
        try {
            const request: UserRouteUpdateInterface = req.body;
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
                response = await updateUserService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            Logger.error('Error Controller: updateUserService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const deleteUser = async (req: Request, res: Response) => {
        try {
            const id = req.query.id as string;
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
                response = await deleteUserService(userData, id);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            Logger.error('Error Controller: deleteUserService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const resetUserPassword = async (req: Request, res: Response) => {
        try {
            const request: UserRouteResetPasswordInterface = req.body;
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
                response = await resetUserPasswordService(userData, request);
                res.status(response.statusCode).json(response);
            }
        } catch (err) {
            Logger.error('Error Controller: updateUserService -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    return {
        getUser,
        getUserByID,
        createUser,
        updateUser,
        resetUserPassword,
        deleteUser
    };
};

import { Request, Response } from 'express';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { HttpResponseRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { useSessionService } from '../services/UserSessionService';

const { logoutSession: logoutSessionService } = useSessionService();

export const useUserSessionController = () => {
    const login = async (req: Request, res: Response) => {
        try {
            // console.log('-------------login------------');
            const token = req.token;
            const session = req.session;
            const response: HttpResponseRouteInterface = { ...HTTP_RESPONSES[HttpResponseType.Success], token, session };
            res.status(response.statusCode).json(response);
        } catch (err) {
            console.log('Error Controller: login -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    const logout = async (req: Request, res: Response) => {
        try {
            const userId = req.query.id as string;
            let response: HttpResponseRouteInterface;

            if (!userId) {
                response = {
                    ...HTTP_RESPONSES[HttpResponseType.ServerError],
                    message: 'User is not authorized to access this api.'
                };
            } else {
                response = await logoutSessionService(userId);
            }

            res.status(response.statusCode).json(response);
        } catch (err) {
            console.log('Error Controller: logout -> ', err);
            const response: HttpResponseRouteInterface = HTTP_RESPONSES[HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    };

    return {
        login,
        logout
    };
};

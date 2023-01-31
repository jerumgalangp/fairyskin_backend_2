import { NextFunction, Request, Response } from 'express';
import { useDecrypt } from '../constant/encryption';
import { Code, HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { SessionEntity } from '../entities/SessionEntites';
import { HttpResponseRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { SessionData, UserAuthenticationLoginRequest } from '../interfaces/routes/UserRouteInterface';
import { useSessionService } from './UserSessionService';

const { validateSessionToken: validateSessionTokenSevice, loginSession: loginSessionDao, getSession: getSessionDao, generateSessionToken: generateSessionTokenDao } = useSessionService();

export const useMiddlewares = () => {
    const validateSession = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.header('X-Token') || '';
        const keyToken = req.header('X-KeyToken') || '';

        if (!token || !keyToken) {
            const response = { ...HTTP_RESPONSES[HttpResponseType.Unauthorized], message: 'Authorization is required.' };
            return res.status(response.statusCode).json(response);
        }

        try {
            const response = await validateSessionTokenSevice(token, keyToken);
            if (response.code !== Code.Success) return res.status(response.statusCode).json(response);
            const tokenDecrypted = JSON.parse(useDecrypt(token) || '{}') as SessionData;
            req.userId = !tokenDecrypted ? tokenDecrypted : tokenDecrypted.user_id;
            req.userName = !tokenDecrypted ? tokenDecrypted : tokenDecrypted.user_name;

            if (!req.userId) {
                const errorResponse = {
                    ...HTTP_RESPONSES[HttpResponseType.ServerError],
                    message: "Something went wrong and we can't process your request right now. Please try again later."
                };
                return res.status(errorResponse.statusCode).json(errorResponse);
            }
            return next();
        } catch (err) {
            const response = { ...HTTP_RESPONSES[HttpResponseType.ServerError], message: "Can't validate session token" };
            return res.status(response.statusCode).json(response);
        }
    };

    const validateImage = async (_req: Request, _res: Response, next: NextFunction) => {
        return next();
    };

    const validateAuthentication = async (req: Request, res: Response, next: NextFunction) => {
        const request: UserAuthenticationLoginRequest = req.body;
        if (!request.username || !request.password) {
            const response = {
                ...HTTP_RESPONSES[HttpResponseType.BadRequest],
                message: 'Invalid username or password.'
            };
            return res.status(response.statusCode).json(response);
        }

        try {
            const response: HttpResponseRouteInterface & { id?: string } = await loginSessionDao(request);
            if (response.code !== Code.Success || !response.id) return res.status(response.statusCode).json(response);
            const data = (await getSessionDao(response.id)) as HttpResponseRouteInterface & { results: SessionEntity };

            // console.log('-----data---------');
            // console.log(data);
            // console.log('-----data------');
            const generatedSessionToken = await generateSessionTokenDao({
                expiry_date: data.results.expiry_date,
                user_id: data.results.user_id,
                user_name: data.results.user.name
            });

            if (typeof generatedSessionToken === 'string') {
                req.token = generatedSessionToken;
                req.session = data.results;
                return next();
            } else {
                if (!generatedSessionToken) {
                    const errorResponse = {
                        ...HTTP_RESPONSES[HttpResponseType.ServerError],
                        message: 'Unable to generate a token.'
                    };
                    return res.status(errorResponse.statusCode).json(errorResponse);
                }

                return res.status(generatedSessionToken.statusCode).json(generatedSessionToken);
            }
        } catch (err) {
            const response = {
                ...HTTP_RESPONSES[HttpResponseType.ServerError],
                message: "Something went wrong and we can't sign you in right now. Please try again later."
            };
            return res.status(response.statusCode).json(response);
        }
    };

    return {
        validateSession,
        validateAuthentication,
        validateImage
    };
};

import { useDecrypt, useEncrypt, useHashCompare } from '../constant/encryption';
import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { useSessionDao } from '../dao/SessionDao';
import { SessionData, UserAuthenticationLoginRequest } from '../interfaces/routes/Session';

const {
    getSession: getSessionDao,
    createSession: createSessionDao,
    extendSession: extendSessionDao,
    destroySession: destroySessionDao,
    verifySession: verifySessionDao,
    loginSession: loginSessionDao,
    checkIfSessionExists: checkIfSessionExistsDao
} = useSessionDao();

export const useSessionService = () => {
    const loginSession = async (request: UserAuthenticationLoginRequest) => {
        try {
            const data = await loginSessionDao(request.username);
            if (!data) return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: 'User not found.' };

            const hashedPassword = data.password || '';
            const userId = data.id;

            if (!(await useHashCompare(request.password, hashedPassword))) return { ...HTTP_RESPONSES[HttpResponseType.BadRequest], message: 'Invalid credential.' };

            const isSessionExists = await checkIfSessionExistsDao(userId);

            if (!isSessionExists) {
                const isCreated = await createSessionDao(userId);
                if (!isCreated) return { ...HTTP_RESPONSES[HttpResponseType.ServerError], message: 'Unable to create session' };
                return { ...HTTP_RESPONSES[HttpResponseType.Success], id: userId };
            } else {
                const isUpdated = await extendSessionDao(userId);
                if (!isUpdated) return { ...HTTP_RESPONSES[HttpResponseType.ServerError], message: 'Unable to update session' };
                return { ...HTTP_RESPONSES[HttpResponseType.Success], id: userId };
            }
        } catch (err) {
            console.log('Error Service: loginSession -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const getSession = async (userId: string) => {
        try {
            const results = await getSessionDao(userId);
            if (!results) return { ...HTTP_RESPONSES[HttpResponseType.ServerError], message: 'No session found.' };
            return { ...HTTP_RESPONSES[HttpResponseType.Success], results };
        } catch (err) {
            console.log('Error Service: getSession -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const logoutSession = async (userId: string) => {
        try {
            const isDestroy = await destroySessionDao(userId);
            if (!isDestroy) return { ...HTTP_RESPONSES[HttpResponseType.ServerError], message: 'Unable to destroy session.' };
            return HTTP_RESPONSES[HttpResponseType.Success];
        } catch (err) {
            console.log('Error Service: logoutSession -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const verifySession = async (userId: string) => {
        try {
            const isValid = await verifySessionDao(userId);
            if (!isValid) return { ...HTTP_RESPONSES[HttpResponseType.Unauthorized], message: 'Session expired.' };
            const isSessionExtended = await extendSessionDao(userId);
            if (!isSessionExtended) return { ...HTTP_RESPONSES[HttpResponseType.ServerError], message: 'Unable to extend session expiry date.' };
            return HTTP_RESPONSES[HttpResponseType.Success];
        } catch (err) {
            console.log('Error Service: verifySession -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const generateSessionToken = (data: SessionData) => {
        try {
            return useEncrypt(JSON.stringify(data));
        } catch (err) {
            console.log('Error Service: generateSessionToken -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const validateSessionToken = async (token: string, keyToken: string) => {
        try {
            const keyTokenDecrypted = useDecrypt(keyToken);
            //console.log("dec",useDecrypt(token))

            if (token !== keyTokenDecrypted) return { ...HTTP_RESPONSES[HttpResponseType.Unauthorized], message: 'Authorization required.' };
            const tokenDecrypted = JSON.parse(useDecrypt(token)) as SessionData;
            return await verifySession(tokenDecrypted.user_id);
        } catch (err) {
            console.log('Error Service: validateSessionToken -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    return {
        loginSession,
        getSession,
        logoutSession,
        generateSessionToken,
        validateSessionToken
    };
};

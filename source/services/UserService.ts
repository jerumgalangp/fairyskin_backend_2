import { useTransformPaginationPayload } from './../transformers/Pagination';
// Author: JPG
// Date: March 4, 2021
// Desc: CREATED FOR AnnouncementManagement Services

import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { useUserDao } from '../dao/UserDao';
import { HeadersRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { UserRouteCreateInterface, UserRouteInterface, UserRouteResetPasswordInterface, UserRouteUpdateInterface } from '../interfaces/routes/UserRouteInterface';
import {
    useUserTransformCreatePayload,
    useUserTransformDeletePayload,
    useUserTransformPayload,
    useUserTransformResetPasswordPayload,
    useUserTransformUpdatePayload
} from '../transformers/UserTransformer';

const { getUser: getUserDao, getUserByID: getUserByIDDao, createUser: createUserDao, updateUser: updateUserDao, deleteUser: deleteUserDao, resetUserPassword: resetUserPasswordDao } = useUserDao();

export const useUserService = () => {
    const getUser = async (request: UserRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);
            const payload = useUserTransformPayload(request);
            //return await getUserDao(payload);
            return await getUserDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getUserDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const getUserByID = async (request: UserRouteInterface, _headers: HeadersRouteInterface) => {
        try {
            const payload = useUserTransformPayload(request);
            return await getUserByIDDao(payload);
        } catch (err) {
            console.log('Error Service: getUserByIDDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const createUser = async (userData: { id: string; table: string }, request: UserRouteCreateInterface) => {
        try {
            const payload = useUserTransformCreatePayload(userData, request);
            return await createUserDao(payload);
        } catch (err) {
            console.log('Error Service: createUserDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const updateUser = async (userData: { id: string; table: string }, request: UserRouteUpdateInterface) => {
        try {
            const payload = useUserTransformUpdatePayload(userData, request);
            return await updateUserDao(request.id, payload);
        } catch (err) {
            console.log('Error Service: updateUser -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const deleteUser = async (userData: { id: string; table: string }, id: string) => {
        try {
            const payload = useUserTransformDeletePayload(userData);
            return await deleteUserDao(id, payload);
        } catch (err) {
            console.log('Error Service: deleteUserDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const resetUserPassword = async (userData: { id: string; table: string }, request: UserRouteResetPasswordInterface) => {
        try {
            const payload = useUserTransformResetPasswordPayload(userData, request);
            return await resetUserPasswordDao(request.id, payload);
        } catch (err) {
            console.log('Error Service: updateUser -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
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

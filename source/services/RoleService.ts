import { useTransformPaginationPayload } from './../transformers/Pagination';

import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { useRoleDao } from '../dao/RoleDao';
import { HeadersRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { RoleRouteCreateInterface, RoleRouteInterface, RoleRouteUpdateInterface } from '../interfaces/routes/RoleRouteInterface';
import { useRoleTransformCreatePayload, useRoleTransformDeletePayload, useRoleTransformPayload, useRoleTransformRestorePayload, useRoleTransformUpdatePayload } from '../transformers/RoleTransformer';

const { getAllRole: getAllRoleDao, getRole: getRoleDao, createRole: createRoleDao, updateRole: updateRoleDao, deleteRole: deleteRoleDao, restoreRole: restoreRoleDao } = useRoleDao();

export const useRoleService = () => {
    const getAllRole = async (request: RoleRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);
            const payload = useRoleTransformPayload(request);
            //return await getRoleDao(payload);
            return await getAllRoleDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getRoleDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const getRole = async (request: RoleRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);
            const payload = useRoleTransformPayload(request);
            //return await getRoleDao(payload);
            return await getRoleDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getRoleDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const createRole = async (RoleData: { id: string; table: string }, request: RoleRouteCreateInterface) => {
        try {
            const payload = useRoleTransformCreatePayload(RoleData, request);
            return await createRoleDao(payload);
        } catch (err) {
            console.log('Error Service: createRoleDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const updateRole = async (RoleData: { id: string; table: string }, request: RoleRouteUpdateInterface) => {
        try {
            const payload = useRoleTransformUpdatePayload(RoleData, request);
            return await updateRoleDao(request.id, payload);
        } catch (err) {
            console.log('Error Service: updateRole -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const deleteRole = async (RoleData: { id: string; table: string }, id: string) => {
        try {
            const payload = useRoleTransformDeletePayload(RoleData);
            return await deleteRoleDao(id, payload);
        } catch (err) {
            console.log('Error Service: deleteRoleDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const restoreRole = async (userData: { id: string; table: string }, id: string) => {
        try {
            const payload = useRoleTransformRestorePayload(userData);
            return await restoreRoleDao(id, payload);
        } catch (err) {
            console.log('Error Service: restoreRole -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    return {
        getAllRole,
        getRole,
        createRole,
        updateRole,
        deleteRole,
        restoreRole
    };
};

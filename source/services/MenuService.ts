import { useTransformPaginationPayload } from './../transformers/Pagination';

import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { useMenuDao } from '../dao/MenuDao';
import { HeadersRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { MenuRouteCreateInterface, MenuRouteInterface, MenuRouteUpdateInterface } from '../interfaces/routes/MenuRouteInterface';
import { useMenuTransformCreatePayload, useMenuTransformDeletePayload, useMenuTransformPayload, useMenuTransformRestorePayload, useMenuTransformUpdatePayload } from '../transformers/MenuTransformer';

const { getAllMenu: getAllMenuDao, getMenu: getMenuDao, createMenu: createMenuDao, updateMenu: updateMenuDao, deleteMenu: deleteMenuDao, restoreMenu: restoreMenuDao } = useMenuDao();

export const useMenuService = () => {
    const getAllMenu = async (request: MenuRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);
            const payload = useMenuTransformPayload(request);
            //return await getMenuDao(payload);
            return await getAllMenuDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getMenuDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const getMenu = async (request: MenuRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);
            //const payload = useMenuTransformPayload(request);
            //return await getMenuDao(payload);
            return await getMenuDao(request, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getMenuDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const createMenu = async (MenuData: { id: string; table: string }, request: MenuRouteCreateInterface) => {
        try {
            const payload = useMenuTransformCreatePayload(MenuData, request);
            return await createMenuDao(payload);
        } catch (err) {
            console.log('Error Service: createMenuDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const updateMenu = async (MenuData: { id: string; table: string }, request: MenuRouteUpdateInterface) => {
        try {
            const payload = useMenuTransformUpdatePayload(MenuData, request);
            return await updateMenuDao(request.id, payload);
        } catch (err) {
            console.log('Error Service: updateMenu -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const deleteMenu = async (MenuData: { id: string; table: string }, id: string) => {
        try {
            const payload = useMenuTransformDeletePayload(MenuData);
            return await deleteMenuDao(id, payload);
        } catch (err) {
            console.log('Error Service: deleteMenuDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const restoreMenu = async (userData: { id: string; table: string }, id: string) => {
        try {
            const payload = useMenuTransformRestorePayload(userData);
            return await restoreMenuDao(id, payload);
        } catch (err) {
            console.log('Error Service: restoreMenu -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    return {
        getAllMenu,
        getMenu,
        createMenu,
        updateMenu,
        deleteMenu,
        restoreMenu
    };
};

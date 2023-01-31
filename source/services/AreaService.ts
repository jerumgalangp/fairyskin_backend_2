import { useTransformPaginationPayload } from './../transformers/Pagination';

import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { useAreaDao } from '../dao/AreaDao';
import { AreaRouteCreateInterface, AreaRouteInterface, AreaRouteUpdateInterface } from '../interfaces/routes/AreaRouteInterface';
import { HeadersRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { useAreaTransformCreatePayload, useAreaTransformDeletePayload, useAreaTransformPayload, useAreaTransformRestorePayload, useAreaTransformUpdatePayload } from '../transformers/AreaTransformer';

const { getAllArea: getAllAreaDao, getArea: getAreaDao, createArea: createAreaDao, updateArea: updateAreaDao, deleteArea: deleteAreaDao, restoreArea: restoreAreaDao } = useAreaDao();

export const useAreaService = () => {
    const getAllArea = async (request: AreaRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);
            const payload = useAreaTransformPayload(request);
            //return await getAreaDao(payload);
            return await getAllAreaDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getAreaDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const getArea = async (request: AreaRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);
            const payload = useAreaTransformPayload(request);
            //return await getAreaDao(payload);
            return await getAreaDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getAreaDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const createArea = async (AreaData: { id: string; table: string }, request: AreaRouteCreateInterface) => {
        try {
            const payload = useAreaTransformCreatePayload(AreaData, request);
            return await createAreaDao(payload);
        } catch (err) {
            console.log('Error Service: createAreaDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const updateArea = async (AreaData: { id: string; table: string }, request: AreaRouteUpdateInterface) => {
        try {
            const payload = useAreaTransformUpdatePayload(AreaData, request);
            return await updateAreaDao(request.id, payload);
        } catch (err) {
            console.log('Error Service: updateArea -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const deleteArea = async (AreaData: { id: string; table: string }, id: string) => {
        try {
            const payload = useAreaTransformDeletePayload(AreaData);
            return await deleteAreaDao(id, payload);
        } catch (err) {
            console.log('Error Service: deleteAreaDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const restoreArea = async (userData: { id: string; table: string }, id: string) => {
        try {
            const payload = useAreaTransformRestorePayload(userData);
            return await restoreAreaDao(id, payload);
        } catch (err) {
            console.log('Error Service: restoreArea -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    return {
        getAllArea,
        getArea,
        createArea,
        updateArea,
        deleteArea,
        restoreArea
    };
};

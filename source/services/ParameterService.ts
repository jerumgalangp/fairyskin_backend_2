import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { useParameterDao } from '../dao/ParameterDao';
import { HeadersRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { ParameterRouteCreateInterface, ParameterRouteInterface, ParameterRouteUpdateInterface } from '../interfaces/routes/ParameterRouteInterface';
import { useTransformPaginationPayload } from '../transformers/Pagination';
import {
    useParameterTransformCreatePayload,
    useParameterTransformDeletePayload,
    useParameterTransformPayload,
    useParameterTransformRestorePayload,
    useParameterTransformUpdatePayload
} from '../transformers/ParameterTransformer';
const {
    getParameter: getParameterDao,
    createParameter: createParameterDao,
    updateParameter: updateParameterDao,
    deleteParameter: deleteParameterDao,
    restoreParameter: restoreParameterDao
} = useParameterDao();

export const useParameterService = () => {
    const getParameter = async (request: ParameterRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);
            const payload = useParameterTransformPayload(request);
            return await getParameterDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getParameterDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const createParameter = async (userData: { id: string; table: string }, request: ParameterRouteCreateInterface) => {
        try {
            const payload = useParameterTransformCreatePayload(userData, request);
            return await createParameterDao(payload);
        } catch (err) {
            console.log('Error Service: createParameterDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const updateParameter = async (userData: { id: string; table: string }, request: ParameterRouteUpdateInterface) => {
        try {
            const payload = useParameterTransformUpdatePayload(userData, request);
            return await updateParameterDao(request.id, payload);
        } catch (err) {
            console.log('Error Service: updateParameter -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const deleteParameter = async (userData: { id: string; table: string }, id: string) => {
        try {
            const payload = useParameterTransformDeletePayload(userData);
            return await deleteParameterDao(id, payload);
        } catch (err) {
            console.log('Error Service: deleteParameterDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const restoreParameter = async (userData: { id: string; table: string }, id: string) => {
        try {
            const payload = useParameterTransformRestorePayload(userData);
            return await restoreParameterDao(id, payload);
        } catch (err) {
            console.log('Error Service: restoreParameter -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    return {
        getParameter,
        createParameter,
        updateParameter,
        deleteParameter,
        restoreParameter
    };
};

import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { useCustomerDao } from '../dao/CustomerDao';
import { CustomerRouteCreateInterface, CustomerRouteInterface, CustomerRouteUpdateInterface } from '../interfaces/routes/CustomerRouteInterface';
import { HeadersRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import {
    useCustomerTransformCreatePayload,
    useCustomerTransformDeletePayload,
    useCustomerTransformPayload,
    useCustomerTransformRestorePayload,
    useCustomerTransformUpdatePayload
} from '../transformers/CustomerTransformer';
import { useTransformPaginationPayload } from '../transformers/Pagination';
const { getCustomer: getCustomerDao, createCustomer: createCustomerDao, updateCustomer: updateCustomerDao, deleteCustomer: deleteCustomerDao, restoreCustomer: restoreCustomerDao } = useCustomerDao();

export const useCustomerService = () => {
    const getCustomer = async (request: CustomerRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);
            const payload = useCustomerTransformPayload(request);
            //return await getUserDao(payload);
            return await getCustomerDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getUserDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const createCustomer = async (userData: { id: string; table: string }, request: CustomerRouteCreateInterface) => {
        try {
            const payload = useCustomerTransformCreatePayload(userData, request);
            return await createCustomerDao(payload);
        } catch (err) {
            console.log('Error Service: createCustomerDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const updateCustomer = async (userData: { id: string; table: string }, request: CustomerRouteUpdateInterface) => {
        try {
            const payload = useCustomerTransformUpdatePayload(userData, request);
            return await updateCustomerDao(request.id, payload);
        } catch (err) {
            console.log('Error Service: updateCustomer -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const deleteCustomer = async (userData: { id: string; table: string }, id: string) => {
        try {
            const payload = useCustomerTransformDeletePayload(userData);
            return await deleteCustomerDao(id, payload);
        } catch (err) {
            console.log('Error Service: deleteCustomerDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const restoreCustomer = async (userData: { id: string; table: string }, id: string) => {
        try {
            const payload = useCustomerTransformRestorePayload(userData);
            return await restoreCustomerDao(id, payload);
        } catch (err) {
            console.log('Error Service: restoreCustomer -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    return {
        getCustomer,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        restoreCustomer
    };
};

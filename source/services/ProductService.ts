import { ProductPendingRouteApprovalInterface, ProductPendingRouteInterface } from './../interfaces/routes/ProductPendingRouteInterface';
import { useTransformPaginationPayload } from './../transformers/Pagination';
import {
    useProductPendingTransformApprovalPayload,
    useProductPendingTransformCreatePayload,
    useProductPendingTransformDeletePayload,
    useProductPendingTransformPayload,
    useProductPendingTransformUpdatePayload
} from './../transformers/ProductPendingTransformer';
import {
    useProductTransformCreatePayload,
    useProductTransformDeletePayload,
    useProductTransformPayload,
    useProductTransformRestorePayload,
    useProductTransformUpdatePayload
} from './../transformers/ProductTransformer';

import { HttpResponseType, HTTP_RESPONSES } from '../constant/HttpConstant';
import { useProductDao } from '../dao/ProductDao';
import { HeadersRouteInterface } from '../interfaces/routes/HttpRoutesInterface';
import { ProductPendingRouteCreateInterface, ProductPendingRouteUpdateInterface } from '../interfaces/routes/ProductPendingRouteInterface';
import { ProductRouteCreateInterface, ProductRouteInterface, ProductRouteUpdateInterface } from '../interfaces/routes/ProductRouteInterface';

const {
    getAllProduct: getAllProductDao,
    getProduct: getProductDao,
    createProduct: createProductDao,
    updateProduct: updateProductDao,
    deleteProduct: deleteProductDao,
    getProductPending: getProductPendingDao,
    createProductPending: createProductPendingDao,
    updateProductPending: updateProductPendingDao,
    deleteProductPending: deleteProductPendingDao,
    approvalProductPending: approvalProductPendingDao,
    restoreProduct: restoreProductDao
} = useProductDao();

export const useProductService = () => {
    const getAllProduct = async (request: ProductRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);
            const payload = useProductTransformPayload(request);
            //return await getProductDao(payload);
            return await getAllProductDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getProductDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const getProduct = async (request: ProductRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);
            const payload = useProductTransformPayload(request);
            //return await getProductDao(payload);
            return await getProductDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getProductDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const createProduct = async (ProductData: { id: string; table: string }, request: ProductRouteCreateInterface) => {
        try {
            const payload = useProductTransformCreatePayload(ProductData, request);
            return await createProductDao(payload);
        } catch (err) {
            console.log('Error Service: createProductDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const updateProduct = async (ProductData: { id: string; table: string }, request: ProductRouteUpdateInterface) => {
        try {
            const payload = useProductTransformUpdatePayload(ProductData, request);
            return await updateProductDao(request.id, payload);
        } catch (err) {
            console.log('Error Service: updateProduct -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const deleteProduct = async (ProductData: { id: string; table: string }, id: string) => {
        try {
            const payload = useProductTransformDeletePayload(ProductData);
            return await deleteProductDao(id, payload);
        } catch (err) {
            console.log('Error Service: deleteProductDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const getProductPending = async (request: ProductPendingRouteInterface, headers: HeadersRouteInterface) => {
        try {
            const transformedPagination = useTransformPaginationPayload(headers);
            const payload = useProductPendingTransformPayload(request);
            //return await getProductDao(payload);
            return await getProductPendingDao(payload, transformedPagination, headers);
        } catch (err) {
            console.log('Error Service: getProductDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const createProductPending = async (productData: { id: string; table: string; userName: string }, request: ProductPendingRouteCreateInterface) => {
        try {
            const payload = useProductPendingTransformCreatePayload(productData, request);
            return await createProductPendingDao(payload);
        } catch (err) {
            console.log('Error Service: createProductDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const updateProductPending = async (ProductData: { id: string; table: string; userName: string }, request: ProductPendingRouteUpdateInterface) => {
        try {
            const payload = useProductPendingTransformUpdatePayload(ProductData, request);
            return await updateProductPendingDao(request.id, payload);
        } catch (err) {
            console.log('Error Service: updateProduct -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const deleteProductPending = async (ProductData: { id: string; table: string; userName: string }, id: string) => {
        try {
            const payload = useProductPendingTransformDeletePayload(ProductData);
            return await deleteProductPendingDao(id, payload);
        } catch (err) {
            console.log('Error Service: deleteProductDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const approvalProductPending = async (ProductData: { id: string; table: string; userName: string }, request: ProductPendingRouteApprovalInterface) => {
        try {
            const payload = useProductPendingTransformApprovalPayload(ProductData, request);
            return await approvalProductPendingDao(request.id, payload);
        } catch (err) {
            console.log('Error Service: deleteProductDao -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    const restoreProduct = async (userData: { id: string; table: string }, id: string) => {
        try {
            const payload = useProductTransformRestorePayload(userData);
            return await restoreProductDao(id, payload);
        } catch (err) {
            console.log('Error Service: restoreProduct -> ', err);
            return HTTP_RESPONSES[HttpResponseType.ServerError];
        }
    };

    return {
        getAllProduct,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
        getProductPending,
        createProductPending,
        updateProductPending,
        deleteProductPending,
        approvalProductPending,
        restoreProduct
    };
};

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useProductService = void 0;
const Pagination_1 = require("./../transformers/Pagination");
const ProductPendingTransformer_1 = require("./../transformers/ProductPendingTransformer");
const ProductTransformer_1 = require("./../transformers/ProductTransformer");
const HttpConstant_1 = require("../constant/HttpConstant");
const ProductDao_1 = require("../dao/ProductDao");
const { getAllProduct: getAllProductDao, getProduct: getProductDao, createProduct: createProductDao, updateProduct: updateProductDao, deleteProduct: deleteProductDao, getProductPending: getProductPendingDao, createProductPending: createProductPendingDao, updateProductPending: updateProductPendingDao, deleteProductPending: deleteProductPendingDao, approvalProductPending: approvalProductPendingDao, restoreProduct: restoreProductDao } = ProductDao_1.useProductDao();
exports.useProductService = () => {
    const getAllProduct = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = ProductTransformer_1.useProductTransformPayload(request);
            return yield getAllProductDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getProductDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const getProduct = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = ProductTransformer_1.useProductTransformPayload(request);
            return yield getProductDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getProductDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const createProduct = (ProductData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = ProductTransformer_1.useProductTransformCreatePayload(ProductData, request);
            return yield createProductDao(payload);
        }
        catch (err) {
            console.log('Error Service: createProductDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const updateProduct = (ProductData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = ProductTransformer_1.useProductTransformUpdatePayload(ProductData, request);
            return yield updateProductDao(request.id, payload);
        }
        catch (err) {
            console.log('Error Service: updateProduct -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const deleteProduct = (ProductData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = ProductTransformer_1.useProductTransformDeletePayload(ProductData);
            return yield deleteProductDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: deleteProductDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const getProductPending = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = ProductPendingTransformer_1.useProductPendingTransformPayload(request);
            return yield getProductPendingDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getProductDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const createProductPending = (productData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = ProductPendingTransformer_1.useProductPendingTransformCreatePayload(productData, request);
            return yield createProductPendingDao(payload);
        }
        catch (err) {
            console.log('Error Service: createProductDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const updateProductPending = (ProductData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = ProductPendingTransformer_1.useProductPendingTransformUpdatePayload(ProductData, request);
            return yield updateProductPendingDao(request.id, payload);
        }
        catch (err) {
            console.log('Error Service: updateProduct -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const deleteProductPending = (ProductData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = ProductPendingTransformer_1.useProductPendingTransformDeletePayload(ProductData);
            return yield deleteProductPendingDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: deleteProductDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const approvalProductPending = (ProductData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = ProductPendingTransformer_1.useProductPendingTransformApprovalPayload(ProductData, request);
            return yield approvalProductPendingDao(request.id, payload);
        }
        catch (err) {
            console.log('Error Service: deleteProductDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const restoreProduct = (userData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = ProductTransformer_1.useProductTransformRestorePayload(userData);
            return yield restoreProductDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: restoreProduct -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
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
//# sourceMappingURL=ProductService.js.map
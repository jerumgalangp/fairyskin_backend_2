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
exports.useOrderService = void 0;
const HttpConstant_1 = require("../constant/HttpConstant");
const OrderDao_1 = require("../dao/OrderDao");
const OrderTransformer_1 = require("../transformers/OrderTransformer");
const OrderDeliveryPendingTransformer_1 = require("./../transformers/OrderDeliveryPendingTransformer");
const OrderTransformer_2 = require("./../transformers/OrderTransformer");
const OrderDeliveryPendingTransformer_2 = require("../transformers/OrderDeliveryPendingTransformer");
const Pagination_1 = require("../transformers/Pagination");
const { getOrder: getOrderDao, getOrderDelivery: getOrderDeliveryDao, getOrderDeliveryPending: getOrderDeliveryPendingDao, getOrderProduct: getOrderProductDao, getOrderDeliveredProduct: getOrderDeliveredProductDao, getOrderDeliveryProduct: getOrderDeliveryProductDao, createOrder: createOrderDao, updateOrder: updateOrderDao, updateOrderDeliveryPending: updateOrderDeliveryPendingDao, approvalOrderDeliveryPending: approvalOrderDeliveryPendingDao, deleteOrder: deleteOrderDao, restoreOrder: restoreOrderDao, getOrderReport: getOrderReportDao } = OrderDao_1.useOrderDao();
exports.useOrderService = () => {
    const getOrder = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            let from_report = request.from_report;
            if (from_report !== undefined) {
                return yield getOrderReportDao(request);
            }
            else {
                const payload = OrderTransformer_1.useOrderTransformPayload(request);
                return yield getOrderDao(payload, transformedPagination, headers);
            }
        }
        catch (err) {
            console.log('Error Service: getOrderService -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const getOrderDelivery = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            let from_report = request.from_report;
            if (from_report !== undefined) {
                return yield getOrderReportDao(request);
            }
            else {
                const payload = OrderTransformer_1.useOrderDeliveryTransformPayload(request);
                return yield getOrderDeliveryDao(payload, transformedPagination, headers);
            }
        }
        catch (err) {
            console.log('Error Service: getOrderDeliveryService -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const getOrderDeliveryPending = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = OrderDeliveryPendingTransformer_1.useOrderDeliveryPendingTransformPayload(request);
            return yield getOrderDeliveryPendingDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getOrderDeliveryPendingService -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const getOrderProduct = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = OrderTransformer_1.useOrderProductTransformPayload(request);
            return yield getOrderProductDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getOrderProductService -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const getOrderDeliveredProduct = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = OrderTransformer_1.useOrderProductTransformPayload(request);
            return yield getOrderDeliveredProductDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getOrderDeliveredProductService -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const getOrderDeliveryProduct = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = OrderTransformer_2.useOrderDeliverProductTransformPayload(request);
            return yield getOrderDeliveryProductDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getOrderDeliveryProduct -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const createOrder = (userData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = OrderTransformer_1.useOrderTransformCreatePayload(userData, request);
            return yield createOrderDao(payload);
        }
        catch (err) {
            console.log('Error Service: createOrderDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const updateOrder = (userData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = OrderTransformer_1.useOrderTransformUpdatePayload(userData, request);
            return yield updateOrderDao(request.id, payload);
        }
        catch (err) {
            console.log('Error Service: updateOrder -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const updateOrderDeliveryPending = (data, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = OrderDeliveryPendingTransformer_2.useOrderDeliveryPendingTransformUpdatePayload(data, request);
            return yield updateOrderDeliveryPendingDao(request.id, payload);
        }
        catch (err) {
            console.log('Error Service: update order deliver pending -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const approvalOrderDeliveryPending = (data, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = OrderDeliveryPendingTransformer_2.useOrderDeliveryPendingTransformApprovalPayload(data, request);
            return yield approvalOrderDeliveryPendingDao(request.id, payload);
        }
        catch (err) {
            console.log('Error Service: approval order deliver pending -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const deleteOrder = (userData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = OrderTransformer_1.useOrderTransformDeletePayload(userData);
            return yield deleteOrderDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: deleteOrderDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const restoreOrder = (userData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = OrderTransformer_1.useOrderTransformRestorePayload(userData);
            return yield restoreOrderDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: restoreOrder -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    return {
        getOrder,
        getOrderDelivery,
        getOrderDeliveryPending,
        getOrderProduct,
        getOrderDeliveredProduct,
        getOrderDeliveryProduct,
        createOrder,
        updateOrder,
        updateOrderDeliveryPending,
        approvalOrderDeliveryPending,
        deleteOrder,
        restoreOrder
    };
};
//# sourceMappingURL=OrderService.js.map
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
exports.usePaymentService = void 0;
const HttpConstant_1 = require("../constant/HttpConstant");
const PaymentDao_1 = require("../dao/PaymentDao");
const Pagination_1 = require("../transformers/Pagination");
const PaymentTransformer_1 = require("../transformers/PaymentTransformer");
const { getPayment: getPaymentDao, getPaymentHistory: getPaymentHistoryDao, createPayment: createPaymentDao, updatePayment: updatePaymentDao, deletePayment: deletePaymentDao, deletePaymentHistory: deletePaymentHistoryDao, restorePayment: restorePaymentDao } = PaymentDao_1.usePaymentDao();
exports.usePaymentService = () => {
    const getPayment = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = PaymentTransformer_1.usePaymentTransformPayload(request);
            return yield getPaymentDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getPaymentDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const getPaymentHistory = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = PaymentTransformer_1.usePaymentHistoryTransformPayload(request);
            return yield getPaymentHistoryDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getPaymentDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const createPayment = (userData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = PaymentTransformer_1.usePaymentTransformCreatePayload(userData, request);
            return yield createPaymentDao(payload);
        }
        catch (err) {
            console.log('Error Service: createPaymentDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const updatePayment = (userData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = PaymentTransformer_1.usePaymentTransformUpdatePayload(userData, request);
            return yield updatePaymentDao(request.id, payload);
        }
        catch (err) {
            console.log('Error Service: updatePayment -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const deletePayment = (userData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = PaymentTransformer_1.usePaymentTransformDeletePayload(userData);
            return yield deletePaymentDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: deletePaymentDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const deletePaymentHistory = (userData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = PaymentTransformer_1.usePaymentTransformDeletePayload(userData);
            return yield deletePaymentHistoryDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: deletePaymentDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const restorePayment = (userData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = PaymentTransformer_1.usePaymentTransformRestorePayload(userData);
            return yield restorePaymentDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: restorePayment -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    return {
        getPayment,
        getPaymentHistory,
        createPayment,
        updatePayment,
        deletePayment,
        deletePaymentHistory,
        restorePayment
    };
};
//# sourceMappingURL=PaymentService.js.map
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
exports.useInvoiceService = void 0;
const InvoicePendingTransformer_1 = require("./../transformers/InvoicePendingTransformer");
const InvoiceTransformer_1 = require("./../transformers/InvoiceTransformer");
const Pagination_1 = require("./../transformers/Pagination");
const HttpConstant_1 = require("../constant/HttpConstant");
const InvoiceDao_1 = require("../dao/InvoiceDao");
const { getAllInvoice: getAllInvoiceDao, getInvoice: getInvoiceDao, createInvoice: createInvoiceDao, updateInvoice: updateInvoiceDao, deleteInvoice: deleteInvoiceDao, getInvoicePending: getInvoicePendingDao, createInvoicePending: createInvoicePendingDao, updateInvoicePending: updateInvoicePendingDao, deleteInvoicePending: deleteInvoicePendingDao, approvalInvoicePending: approvalInvoicePendingDao, restoreInvoice: restoreInvoiceDao } = InvoiceDao_1.useInvoiceDao();
exports.useInvoiceService = () => {
    const getAllInvoice = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = InvoiceTransformer_1.useInvoiceTransformPayload(request);
            return yield getAllInvoiceDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getInvoiceDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const getInvoice = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = InvoiceTransformer_1.useInvoiceTransformPayload(request);
            return yield getInvoiceDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getInvoiceDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const createInvoice = (InvoiceData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = InvoiceTransformer_1.useInvoiceTransformCreatePayload(InvoiceData, request);
            return yield createInvoiceDao(payload);
        }
        catch (err) {
            console.log('Error Service: createInvoiceDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const updateInvoice = (InvoiceData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = InvoiceTransformer_1.useInvoiceTransformUpdatePayload(InvoiceData, request);
            return yield updateInvoiceDao(request.id, payload);
        }
        catch (err) {
            console.log('Error Service: updateInvoice -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const deleteInvoice = (InvoiceData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = InvoiceTransformer_1.useInvoiceTransformDeletePayload(InvoiceData);
            return yield deleteInvoiceDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: deleteInvoiceDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const getInvoicePending = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = InvoicePendingTransformer_1.useInvoicePendingTransformPayload(request);
            return yield getInvoicePendingDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getInvoiceDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const createInvoicePending = (InvoiceData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = InvoicePendingTransformer_1.useInvoicePendingTransformCreatePayload(InvoiceData, request);
            return yield createInvoicePendingDao(payload);
        }
        catch (err) {
            console.log('Error Service: createInvoiceDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const updateInvoicePending = (InvoiceData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = InvoicePendingTransformer_1.useInvoicePendingTransformUpdatePayload(InvoiceData, request);
            return yield updateInvoicePendingDao(request.id, payload);
        }
        catch (err) {
            console.log('Error Service: updateInvoice -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const deleteInvoicePending = (InvoiceData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = InvoicePendingTransformer_1.useInvoicePendingTransformDeletePayload(InvoiceData);
            return yield deleteInvoicePendingDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: deleteInvoiceDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const approvalInvoicePending = (InvoiceData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = InvoicePendingTransformer_1.useInvoicePendingTransformApprovalPayload(InvoiceData, request);
            return yield approvalInvoicePendingDao(request.id, payload);
        }
        catch (err) {
            console.log('Error Service: deleteInvoiceDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const restoreInvoice = (userData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = InvoiceTransformer_1.useInvoiceTransformRestorePayload(userData);
            return yield restoreInvoiceDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: restoreInvoice -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    return {
        getAllInvoice,
        getInvoice,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoicePending,
        createInvoicePending,
        updateInvoicePending,
        deleteInvoicePending,
        approvalInvoicePending,
        restoreInvoice
    };
};
//# sourceMappingURL=InvoiceService.js.map
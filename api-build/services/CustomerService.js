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
exports.useCustomerService = void 0;
const HttpConstant_1 = require("../constant/HttpConstant");
const CustomerDao_1 = require("../dao/CustomerDao");
const CustomerTransformer_1 = require("../transformers/CustomerTransformer");
const Pagination_1 = require("../transformers/Pagination");
const { getCustomer: getCustomerDao, createCustomer: createCustomerDao, updateCustomer: updateCustomerDao, deleteCustomer: deleteCustomerDao, restoreCustomer: restoreCustomerDao } = CustomerDao_1.useCustomerDao();
exports.useCustomerService = () => {
    const getCustomer = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = CustomerTransformer_1.useCustomerTransformPayload(request);
            return yield getCustomerDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getUserDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const createCustomer = (userData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = CustomerTransformer_1.useCustomerTransformCreatePayload(userData, request);
            return yield createCustomerDao(payload);
        }
        catch (err) {
            console.log('Error Service: createCustomerDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const updateCustomer = (userData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = CustomerTransformer_1.useCustomerTransformUpdatePayload(userData, request);
            return yield updateCustomerDao(request.id, payload);
        }
        catch (err) {
            console.log('Error Service: updateCustomer -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const deleteCustomer = (userData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = CustomerTransformer_1.useCustomerTransformDeletePayload(userData);
            return yield deleteCustomerDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: deleteCustomerDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const restoreCustomer = (userData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = CustomerTransformer_1.useCustomerTransformRestorePayload(userData);
            return yield restoreCustomerDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: restoreCustomer -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    return {
        getCustomer,
        createCustomer,
        updateCustomer,
        deleteCustomer,
        restoreCustomer
    };
};
//# sourceMappingURL=CustomerService.js.map
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
exports.useParameterService = void 0;
const HttpConstant_1 = require("../constant/HttpConstant");
const ParameterDao_1 = require("../dao/ParameterDao");
const Pagination_1 = require("../transformers/Pagination");
const ParameterTransformer_1 = require("../transformers/ParameterTransformer");
const { getParameter: getParameterDao, createParameter: createParameterDao, updateParameter: updateParameterDao, deleteParameter: deleteParameterDao, restoreParameter: restoreParameterDao } = ParameterDao_1.useParameterDao();
exports.useParameterService = () => {
    const getParameter = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = ParameterTransformer_1.useParameterTransformPayload(request);
            return yield getParameterDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getParameterDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const createParameter = (userData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = ParameterTransformer_1.useParameterTransformCreatePayload(userData, request);
            return yield createParameterDao(payload);
        }
        catch (err) {
            console.log('Error Service: createParameterDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const updateParameter = (userData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = ParameterTransformer_1.useParameterTransformUpdatePayload(userData, request);
            return yield updateParameterDao(request.id, payload);
        }
        catch (err) {
            console.log('Error Service: updateParameter -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const deleteParameter = (userData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = ParameterTransformer_1.useParameterTransformDeletePayload(userData);
            return yield deleteParameterDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: deleteParameterDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const restoreParameter = (userData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = ParameterTransformer_1.useParameterTransformRestorePayload(userData);
            return yield restoreParameterDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: restoreParameter -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    return {
        getParameter,
        createParameter,
        updateParameter,
        deleteParameter,
        restoreParameter
    };
};
//# sourceMappingURL=ParameterService.js.map
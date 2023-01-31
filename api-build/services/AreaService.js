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
exports.useAreaService = void 0;
const Pagination_1 = require("./../transformers/Pagination");
const HttpConstant_1 = require("../constant/HttpConstant");
const AreaDao_1 = require("../dao/AreaDao");
const AreaTransformer_1 = require("../transformers/AreaTransformer");
const { getAllArea: getAllAreaDao, getArea: getAreaDao, createArea: createAreaDao, updateArea: updateAreaDao, deleteArea: deleteAreaDao, restoreArea: restoreAreaDao } = AreaDao_1.useAreaDao();
exports.useAreaService = () => {
    const getAllArea = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = AreaTransformer_1.useAreaTransformPayload(request);
            return yield getAllAreaDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getAreaDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const getArea = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = AreaTransformer_1.useAreaTransformPayload(request);
            return yield getAreaDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getAreaDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const createArea = (AreaData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = AreaTransformer_1.useAreaTransformCreatePayload(AreaData, request);
            return yield createAreaDao(payload);
        }
        catch (err) {
            console.log('Error Service: createAreaDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const updateArea = (AreaData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = AreaTransformer_1.useAreaTransformUpdatePayload(AreaData, request);
            return yield updateAreaDao(request.id, payload);
        }
        catch (err) {
            console.log('Error Service: updateArea -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const deleteArea = (AreaData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = AreaTransformer_1.useAreaTransformDeletePayload(AreaData);
            return yield deleteAreaDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: deleteAreaDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const restoreArea = (userData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = AreaTransformer_1.useAreaTransformRestorePayload(userData);
            return yield restoreAreaDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: restoreArea -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    return {
        getAllArea,
        getArea,
        createArea,
        updateArea,
        deleteArea,
        restoreArea
    };
};
//# sourceMappingURL=AreaService.js.map
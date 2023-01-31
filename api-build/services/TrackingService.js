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
exports.useTrackingService = void 0;
const HttpConstant_1 = require("../constant/HttpConstant");
const TrackingDao_1 = require("../dao/TrackingDao");
const TrackingTransformer_1 = require("../transformers/TrackingTransformer");
const TrackingTransformer_2 = require("./../transformers/TrackingTransformer");
const Pagination_1 = require("../transformers/Pagination");
const { getOrdersForTracking: getOrdersForTrackingDao, getTracking: getTrackingDao, getOrderDistributed: getOrderDistributedDao, createTracking: createTrackingDao, updateTracking: updateTrackingDao, deleteTracking: deleteTrackingDao, restoreTracking: restoreTrackingDao } = TrackingDao_1.useTrackingDao();
exports.useTrackingService = () => {
    const getOrdersForTracking = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = TrackingTransformer_1.useOrderTrackingTransformPayload(request);
            return yield getOrdersForTrackingDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getOrderService -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const getTracking = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = TrackingTransformer_1.useTrackingTransformPayload(request);
            return yield getTrackingDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getTrackingService -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const getOrderDistributed = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = TrackingTransformer_2.useOrderDistributedTransformPayload(request);
            return yield getOrderDistributedDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getOrderDistributedDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const createTracking = (userData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = TrackingTransformer_1.useTrackingTransformCreatePayload(userData, request);
            return yield createTrackingDao(payload);
        }
        catch (err) {
            console.log('Error Service: createTrackingDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const updateTracking = (userData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = TrackingTransformer_1.useTrackingTransformUpdatePayload(userData, request);
            return yield updateTrackingDao(request.id, payload);
        }
        catch (err) {
            console.log('Error Service: updateTracking -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const deleteTracking = (userData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = TrackingTransformer_1.useTrackingTransformDeletePayload(userData);
            return yield deleteTrackingDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: deleteTrackingDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const restoreTracking = (userData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = TrackingTransformer_1.useTrackingTransformRestorePayload(userData);
            return yield restoreTrackingDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: restoreTracking -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    return {
        getOrdersForTracking,
        getTracking,
        getOrderDistributed,
        createTracking,
        updateTracking,
        deleteTracking,
        restoreTracking
    };
};
//# sourceMappingURL=TrackingService.js.map
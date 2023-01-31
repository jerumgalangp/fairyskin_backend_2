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
exports.useReportService = void 0;
const Pagination_1 = require("./../transformers/Pagination");
const HttpConstant_1 = require("../constant/HttpConstant");
const ReportDao_1 = require("../dao/ReportDao");
const ReportTransformer_1 = require("../transformers/ReportTransformer");
const { getQSPR: getQSPRDao, getTSPR: getTSPRDao, getPPR: getPPRDao } = ReportDao_1.useReportDao();
exports.useReportService = () => {
    const getQSPR = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = ReportTransformer_1.useReportTransformPayload(request);
            return yield getQSPRDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getAreaDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const getTSPR = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = ReportTransformer_1.useReportTransformPayload(request);
            return yield getTSPRDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getAreaDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const getPPR = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = ReportTransformer_1.useReportTransformPayload(request);
            return yield getPPRDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getAreaDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    return {
        getQSPR,
        getTSPR,
        getPPR
    };
};
//# sourceMappingURL=ReportService.js.map
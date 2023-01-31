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
exports.useDashboardService = void 0;
const HttpConstant_1 = require("../constant/HttpConstant");
const DashboardDao_1 = require("../dao/DashboardDao");
const DashboardTransformer_1 = require("./../transformers/DashboardTransformer");
const { getDashboardSalesPerTransaction: getDashboardSalesPerTransactionDao } = DashboardDao_1.useDashboardDao();
exports.useDashboardService = () => {
    const getDashboardSalesPerTransaction = (request, _headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = DashboardTransformer_1.useDashboardTransform(request);
            return yield getDashboardSalesPerTransactionDao(payload);
        }
        catch (err) {
            console.log('Error Service: getDashboardSalesPerTransactionService -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    return {
        getDashboardSalesPerTransaction
    };
};
//# sourceMappingURL=DashboardService.js.map
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
exports.useDashboardController = void 0;
const HttpConstant_1 = require("../constant/HttpConstant");
const DashboardService_1 = require("../services/DashboardService");
const { getDashboardSalesPerTransaction: getDashboardSalesPerTransactionService } = DashboardService_1.useDashboardService();
exports.useDashboardController = () => {
    const getDashboardSalesPerTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const request = req.query;
            const userId = req.userId;
            let response;
            if (!userId) {
                response = Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError]), { message: 'User is not authorized to access this api.' });
                res.status(response.statusCode).json(response);
            }
            else {
                const headers = req.headers;
                const response = yield getDashboardSalesPerTransactionService(request, headers);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: getDashboardTotalCountService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    return {
        getDashboardSalesPerTransaction
    };
};
//# sourceMappingURL=DashboardController.js.map
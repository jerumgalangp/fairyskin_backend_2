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
exports.usePaymentController = void 0;
const HttpConstant_1 = require("../constant/HttpConstant");
const PaymentService_1 = require("../services/PaymentService");
const { getPayment: getPaymentService, getPaymentHistory: getPaymentHistoryService, createPayment: createPaymentService, updatePayment: updatePaymentService, deletePayment: deletePaymentService, deletePaymentHistory: deletePaymentHistoryService, restorePayment: restorePaymentService } = PaymentService_1.usePaymentService();
exports.usePaymentController = () => {
    const getPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const request = req.query;
            const headers = req.headers;
            const response = yield getPaymentService(request, headers);
            res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.log('Error Controller: getPaymentService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const getPaymentHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const request = req.query;
            const headers = req.headers;
            const response = yield getPaymentHistoryService(request, headers);
            res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.log('Error Controller: getPaymentService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const request = req.body;
            const userId = req.userId;
            const userTable = req.userTable;
            let response;
            if (!userId) {
                response = Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError]), { message: 'User is not authorized to access this api.' });
                res.status(response.statusCode).json(response);
            }
            else {
                const userData = { id: userId, table: userTable };
                response = yield createPaymentService(userData, request);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: createPaymentService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const updatePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const request = req.body;
            const userId = req.userId;
            const userTable = req.userTable;
            let response;
            if (!userId) {
                response = Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError]), { message: 'User is not authorized to access this api.' });
                res.status(response.statusCode).json(response);
            }
            else {
                const userData = { id: userId, table: userTable };
                response = yield updatePaymentService(userData, request);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: updatePaymentService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const deletePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.query.id;
            let response;
            const userId = req.userId;
            const userTable = req.userTable;
            if (!userId) {
                response = Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError]), { message: 'User is not authorized to access this api.' });
                res.status(response.statusCode).json(response);
            }
            else {
                const userData = { id: userId, table: userTable };
                response = yield deletePaymentService(userData, id);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: deletePaymentService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const deletePaymentHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.query.id;
            let response;
            const userId = req.userId;
            const userTable = req.userTable;
            if (!userId) {
                response = Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError]), { message: 'User is not authorized to access this api.' });
                res.status(response.statusCode).json(response);
            }
            else {
                const userData = { id: userId, table: userTable };
                response = yield deletePaymentHistoryService(userData, id);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: deletePaymentHistoryService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const restorePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.query.id;
            const userId = req.userId;
            const userTable = req.userTable;
            let response;
            if (!userId || !userTable) {
                response = Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError]), { message: 'User is not authorized to access this api.' });
                res.status(response.statusCode).json(response);
            }
            else {
                const userData = { id: userId, table: userTable };
                response = yield restorePaymentService(userData, id);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: restorePaymentService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
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
//# sourceMappingURL=PaymentController.js.map
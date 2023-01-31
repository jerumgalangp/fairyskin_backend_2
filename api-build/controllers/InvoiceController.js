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
exports.useInvoiceController = void 0;
const HttpConstant_1 = require("../constant/HttpConstant");
const InvoiceService_1 = require("../services/InvoiceService");
const { getAllInvoice: getAllInvoiceService, getInvoice: getInvoiceService, createInvoice: createInvoiceService, updateInvoice: updateInvoiceService, deleteInvoice: deleteInvoiceService, getInvoicePending: getInvoicePendingService, createInvoicePending: createInvoicePendingService, updateInvoicePending: updateInvoicePendingService, deleteInvoicePending: deleteInvoicePendingService, approvalInvoicePending: approvalInvoicePendingService, restoreInvoice: restoreInvoiceService } = InvoiceService_1.useInvoiceService();
exports.useInvoiceController = () => {
    const getAllInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                const response = yield getAllInvoiceService(request, headers);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: getInvoiceService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const getInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                const response = yield getInvoiceService(request, headers);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: getInvoiceService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const createInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                response = yield createInvoiceService(userData, request);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: createInvoiceService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const updateInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                response = yield updateInvoiceService(userData, request);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: updateInvoiceService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const deleteInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                response = yield deleteInvoiceService(userData, id);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: deleteInvoiceService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const getInvoicePending = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                const response = yield getInvoicePendingService(request, headers);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: getInvoiceService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const createInvoicePending = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const request = req.body;
            const userId = req.userId;
            const userTable = req.userTable;
            const userName = req.userName;
            let response;
            if (!userId) {
                response = Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError]), { message: 'User is not authorized to access this api.' });
                res.status(response.statusCode).json(response);
            }
            else {
                const userData = { id: userId, table: userTable, userName: userName };
                response = yield createInvoicePendingService(userData, request);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: createInvoiceService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const updateInvoicePending = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const request = req.body;
            const userId = req.userId;
            const userTable = req.userTable;
            const userName = req.userName;
            let response;
            if (!userId) {
                response = Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError]), { message: 'User is not authorized to access this api.' });
                res.status(response.statusCode).json(response);
            }
            else {
                const userData = { id: userId, table: userTable, userName: userName };
                response = yield updateInvoicePendingService(userData, request);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: updateInvoiceService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const deleteInvoicePending = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.query.id;
            let response;
            const userId = req.userId;
            const userTable = req.userTable;
            const userName = req.userName;
            if (!userId) {
                response = Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError]), { message: 'User is not authorized to access this api.' });
                res.status(response.statusCode).json(response);
            }
            else {
                const userData = { id: userId, table: userTable, userName: userName };
                response = yield deleteInvoicePendingService(userData, id);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: deleteInvoiceService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const approvalInvoicePending = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const request = req.body;
            let response;
            const userId = req.userId;
            const userTable = req.userTable;
            const userName = req.userName;
            if (!userId) {
                response = Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError]), { message: 'User is not authorized to access this api.' });
                res.status(response.statusCode).json(response);
            }
            else {
                const userData = { id: userId, table: userTable, userName: userName };
                response = yield approvalInvoicePendingService(userData, request);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: rejectInvoicePending -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const restoreInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                response = yield restoreInvoiceService(userData, id);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: restoreInvoiceService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
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
//# sourceMappingURL=InvoiceController.js.map
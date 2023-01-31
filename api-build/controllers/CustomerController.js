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
exports.useCustomerController = void 0;
const HttpConstant_1 = require("../constant/HttpConstant");
const CustomerService_1 = require("../services/CustomerService");
const { getCustomer: getCustomerService, createCustomer: createCustomerService, updateCustomer: updateCustomerService, deleteCustomer: deleteCustomerService, restoreCustomer: restoreCustomerService } = CustomerService_1.useCustomerService();
exports.useCustomerController = () => {
    const getCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                const response = yield getCustomerService(request, headers);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: getCustomerService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const createCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                response = yield createCustomerService(userData, request);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: createCustomerService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const updateCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                response = yield updateCustomerService(userData, request);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: updateCustomerService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const deleteCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                response = yield deleteCustomerService(userData, id);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: deleteCustomerService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const restoreCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                response = yield restoreCustomerService(userData, id);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: restoreCustomerService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
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
//# sourceMappingURL=CustomerController.js.map
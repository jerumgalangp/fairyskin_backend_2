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
exports.useOrderController = void 0;
const HttpConstant_1 = require("../constant/HttpConstant");
const OrderService_1 = require("../services/OrderService");
const { getOrder: getOrderService, getOrderDelivery: getOrderDeliveryService, getOrderDeliveryPending: getOrderDeliveryPendingService, getOrderProduct: getOrderProductService, getOrderDeliveredProduct: getOrderDeliveredProductService, getOrderDeliveryProduct: getOrderDeliveryProductService, createOrder: createOrderService, updateOrder: updateOrderService, updateOrderDeliveryPending: updateOrderDeliveryPendingService, approvalOrderDeliveryPending: approvalOrderDeliveryService, deleteOrder: deleteOrderService, restoreOrder: restoreOrderService } = OrderService_1.useOrderService();
exports.useOrderController = () => {
    const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const request = req.query;
            const headers = req.headers;
            const response = yield getOrderService(request, headers);
            res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.log('Error Controller: getOrderService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const getOrderDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const request = req.query;
            const headers = req.headers;
            const response = yield getOrderDeliveryService(request, headers);
            res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.log('Error Controller: getOrderDeliveryService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const getOrderDeliveryPending = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const request = req.query;
            const headers = req.headers;
            const response = yield getOrderDeliveryPendingService(request, headers);
            res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.log('Error Controller: getOrderDeliveryPendingService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const getOrderProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const request = req.query;
            const headers = req.headers;
            const response = yield getOrderProductService(request, headers);
            res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.log('Error Controller: getOrderProductService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const getOrderDeliveredProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const request = req.query;
            const headers = req.headers;
            const response = yield getOrderDeliveredProductService(request, headers);
            res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.log('Error Controller: getOrderDeliveredProduct -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const getOrderDeliveryProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const request = req.query;
            const headers = req.headers;
            const response = yield getOrderDeliveryProductService(request, headers);
            res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.log('Error Controller: getOrderDeliveryProductService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                response = yield createOrderService(userData, request);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: createOrderService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const createOrderFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const request = req.body;
            const userId = req.userId;
            const userTable = req.userTable;
            let response;
            console.log('----------order-------controller-=-----------');
            console.log(req.body);
            console.log('----------order-------controller-=-----------');
            if (!userId) {
                response = Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError]), { message: 'User is not authorized to access this api.' });
                res.status(response.statusCode).json(response);
            }
            else {
                const userData = { id: userId, table: userTable };
                response = yield createOrderService(userData, request);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: createItemService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                response = yield updateOrderService(userData, request);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: updateOrderService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const updateOrderFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                response = yield updateOrderService(userData, request);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: updateOrderService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const updateOrderDeliveryPending = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                response = yield updateOrderDeliveryPendingService(userData, request);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: updateInvoiceService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const approvalOrderDeliveryPending = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                response = yield approvalOrderDeliveryService(userData, request);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: rejectInvoicePending -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                response = yield deleteOrderService(userData, id);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: deleteOrderService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const restoreOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                response = yield restoreOrderService(userData, id);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            console.log('Error Controller: restoreOrderService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    return {
        getOrder,
        getOrderDelivery,
        getOrderDeliveryPending,
        getOrderProduct,
        getOrderDeliveredProduct,
        getOrderDeliveryProduct,
        createOrder,
        createOrderFile,
        updateOrder,
        updateOrderDeliveryPending,
        approvalOrderDeliveryPending,
        updateOrderFile,
        deleteOrder,
        restoreOrder
    };
};
//# sourceMappingURL=OrderController.js.map
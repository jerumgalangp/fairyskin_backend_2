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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserController = void 0;
const winston_logger_1 = __importDefault(require("../common/logger/winston.logger"));
const HttpConstant_1 = require("../constant/HttpConstant");
const UserService_1 = require("../services/UserService");
const { getUser: getUserService, getUserByID: getUserByIDService, createUser: createUserService, updateUser: updateUserService, deleteUser: deleteUserService, resetUserPassword: resetUserPasswordService } = UserService_1.useUserService();
exports.useUserController = () => {
    const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const request = req.query;
            const headers = req.headers;
            const response = yield getUserService(request, headers);
            res.status(response.statusCode).json(response);
        }
        catch (err) {
            winston_logger_1.default.error('Error Controller: getUserService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const getUserByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const request = req.query;
            const headers = req.headers;
            const response = yield getUserByIDService(request, headers);
            res.status(response.statusCode).json(response);
        }
        catch (err) {
            winston_logger_1.default.error('Error Controller: getUserByIDService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                response = yield createUserService(userData, request);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            winston_logger_1.default.error('Error Controller: createUserService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                response = yield updateUserService(userData, request);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            winston_logger_1.default.error('Error Controller: updateUserService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.query.id;
            const userId = req.userId;
            const userTable = req.userTable;
            let response;
            if (!userId) {
                response = Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError]), { message: 'User is not authorized to access this api.' });
                res.status(response.statusCode).json(response);
            }
            else {
                const userData = { id: userId, table: userTable };
                response = yield deleteUserService(userData, id);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            winston_logger_1.default.error('Error Controller: deleteUserService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const resetUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                response = yield resetUserPasswordService(userData, request);
                res.status(response.statusCode).json(response);
            }
        }
        catch (err) {
            winston_logger_1.default.error('Error Controller: updateUserService -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    return {
        getUser,
        getUserByID,
        createUser,
        updateUser,
        resetUserPassword,
        deleteUser
    };
};
//# sourceMappingURL=UserController.js.map
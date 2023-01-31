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
exports.useUserService = void 0;
const Pagination_1 = require("./../transformers/Pagination");
const HttpConstant_1 = require("../constant/HttpConstant");
const UserDao_1 = require("../dao/UserDao");
const UserTransformer_1 = require("../transformers/UserTransformer");
const { getUser: getUserDao, getUserByID: getUserByIDDao, createUser: createUserDao, updateUser: updateUserDao, deleteUser: deleteUserDao, resetUserPassword: resetUserPasswordDao } = UserDao_1.useUserDao();
exports.useUserService = () => {
    const getUser = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = UserTransformer_1.useUserTransformPayload(request);
            return yield getUserDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getUserDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const getUserByID = (request, _headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = UserTransformer_1.useUserTransformPayload(request);
            return yield getUserByIDDao(payload);
        }
        catch (err) {
            console.log('Error Service: getUserByIDDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const createUser = (userData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = UserTransformer_1.useUserTransformCreatePayload(userData, request);
            return yield createUserDao(payload);
        }
        catch (err) {
            console.log('Error Service: createUserDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const updateUser = (userData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = UserTransformer_1.useUserTransformUpdatePayload(userData, request);
            return yield updateUserDao(request.id, payload);
        }
        catch (err) {
            console.log('Error Service: updateUser -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const deleteUser = (userData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = UserTransformer_1.useUserTransformDeletePayload(userData);
            return yield deleteUserDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: deleteUserDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const resetUserPassword = (userData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = UserTransformer_1.useUserTransformResetPasswordPayload(userData, request);
            return yield resetUserPasswordDao(request.id, payload);
        }
        catch (err) {
            console.log('Error Service: updateUser -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
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
//# sourceMappingURL=UserService.js.map
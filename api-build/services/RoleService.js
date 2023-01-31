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
exports.useRoleService = void 0;
const Pagination_1 = require("./../transformers/Pagination");
const HttpConstant_1 = require("../constant/HttpConstant");
const RoleDao_1 = require("../dao/RoleDao");
const RoleTransformer_1 = require("../transformers/RoleTransformer");
const { getAllRole: getAllRoleDao, getRole: getRoleDao, createRole: createRoleDao, updateRole: updateRoleDao, deleteRole: deleteRoleDao, restoreRole: restoreRoleDao } = RoleDao_1.useRoleDao();
exports.useRoleService = () => {
    const getAllRole = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = RoleTransformer_1.useRoleTransformPayload(request);
            return yield getAllRoleDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getRoleDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const getRole = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = RoleTransformer_1.useRoleTransformPayload(request);
            return yield getRoleDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getRoleDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const createRole = (RoleData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = RoleTransformer_1.useRoleTransformCreatePayload(RoleData, request);
            return yield createRoleDao(payload);
        }
        catch (err) {
            console.log('Error Service: createRoleDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const updateRole = (RoleData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = RoleTransformer_1.useRoleTransformUpdatePayload(RoleData, request);
            return yield updateRoleDao(request.id, payload);
        }
        catch (err) {
            console.log('Error Service: updateRole -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const deleteRole = (RoleData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = RoleTransformer_1.useRoleTransformDeletePayload(RoleData);
            return yield deleteRoleDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: deleteRoleDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const restoreRole = (userData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = RoleTransformer_1.useRoleTransformRestorePayload(userData);
            return yield restoreRoleDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: restoreRole -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    return {
        getAllRole,
        getRole,
        createRole,
        updateRole,
        deleteRole,
        restoreRole
    };
};
//# sourceMappingURL=RoleService.js.map
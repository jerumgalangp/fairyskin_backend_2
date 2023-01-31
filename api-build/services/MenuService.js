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
exports.useMenuService = void 0;
const Pagination_1 = require("./../transformers/Pagination");
const HttpConstant_1 = require("../constant/HttpConstant");
const MenuDao_1 = require("../dao/MenuDao");
const MenuTransformer_1 = require("../transformers/MenuTransformer");
const { getAllMenu: getAllMenuDao, getMenu: getMenuDao, createMenu: createMenuDao, updateMenu: updateMenuDao, deleteMenu: deleteMenuDao, restoreMenu: restoreMenuDao } = MenuDao_1.useMenuDao();
exports.useMenuService = () => {
    const getAllMenu = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            const payload = MenuTransformer_1.useMenuTransformPayload(request);
            return yield getAllMenuDao(payload, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getMenuDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const getMenu = (request, headers) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transformedPagination = Pagination_1.useTransformPaginationPayload(headers);
            return yield getMenuDao(request, transformedPagination, headers);
        }
        catch (err) {
            console.log('Error Service: getMenuDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const createMenu = (MenuData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = MenuTransformer_1.useMenuTransformCreatePayload(MenuData, request);
            return yield createMenuDao(payload);
        }
        catch (err) {
            console.log('Error Service: createMenuDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const updateMenu = (MenuData, request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = MenuTransformer_1.useMenuTransformUpdatePayload(MenuData, request);
            return yield updateMenuDao(request.id, payload);
        }
        catch (err) {
            console.log('Error Service: updateMenu -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const deleteMenu = (MenuData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = MenuTransformer_1.useMenuTransformDeletePayload(MenuData);
            return yield deleteMenuDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: deleteMenuDao -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const restoreMenu = (userData, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const payload = MenuTransformer_1.useMenuTransformRestorePayload(userData);
            return yield restoreMenuDao(id, payload);
        }
        catch (err) {
            console.log('Error Service: restoreMenu -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    return {
        getAllMenu,
        getMenu,
        createMenu,
        updateMenu,
        deleteMenu,
        restoreMenu
    };
};
//# sourceMappingURL=MenuService.js.map
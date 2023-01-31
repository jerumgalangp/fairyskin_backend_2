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
exports.useUserSessionController = void 0;
const HttpConstant_1 = require("../constant/HttpConstant");
const UserSessionService_1 = require("../services/UserSessionService");
const { logoutSession: logoutSessionService } = UserSessionService_1.useSessionService();
exports.useUserSessionController = () => {
    const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.token;
            const session = req.session;
            const response = Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success]), { token, session });
            res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.log('Error Controller: login -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.query.id;
            let response;
            if (!userId) {
                response = Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError]), { message: 'User is not authorized to access this api.' });
            }
            else {
                response = yield logoutSessionService(userId);
            }
            res.status(response.statusCode).json(response);
        }
        catch (err) {
            console.log('Error Controller: logout -> ', err);
            const response = HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
            res.status(response.statusCode).json(response);
        }
    });
    return {
        login,
        logout
    };
};
//# sourceMappingURL=UserAuthenticateController.js.map
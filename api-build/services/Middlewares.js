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
exports.useMiddlewares = void 0;
const encryption_1 = require("../constant/encryption");
const HttpConstant_1 = require("../constant/HttpConstant");
const UserSessionService_1 = require("./UserSessionService");
const { validateSessionToken: validateSessionTokenSevice, loginSession: loginSessionDao, getSession: getSessionDao, generateSessionToken: generateSessionTokenDao } = UserSessionService_1.useSessionService();
exports.useMiddlewares = () => {
    const validateSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.header('X-Token') || '';
        const keyToken = req.header('X-KeyToken') || '';
        if (!token || !keyToken) {
            const response = Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Unauthorized]), { message: 'Authorization is required.' });
            return res.status(response.statusCode).json(response);
        }
        try {
            const response = yield validateSessionTokenSevice(token, keyToken);
            if (response.code !== HttpConstant_1.Code.Success)
                return res.status(response.statusCode).json(response);
            const tokenDecrypted = JSON.parse(encryption_1.useDecrypt(token) || '{}');
            req.userId = !tokenDecrypted ? tokenDecrypted : tokenDecrypted.user_id;
            req.userName = !tokenDecrypted ? tokenDecrypted : tokenDecrypted.user_name;
            if (!req.userId) {
                const errorResponse = Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError]), { message: "Something went wrong and we can't process your request right now. Please try again later." });
                return res.status(errorResponse.statusCode).json(errorResponse);
            }
            return next();
        }
        catch (err) {
            const response = Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError]), { message: "Can't validate session token" });
            return res.status(response.statusCode).json(response);
        }
    });
    const validateImage = (_req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
        return next();
    });
    const validateAuthentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const request = req.body;
        if (!request.username || !request.password) {
            const response = Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: 'Invalid username or password.' });
            return res.status(response.statusCode).json(response);
        }
        try {
            const response = yield loginSessionDao(request);
            if (response.code !== HttpConstant_1.Code.Success || !response.id)
                return res.status(response.statusCode).json(response);
            const data = (yield getSessionDao(response.id));
            const generatedSessionToken = yield generateSessionTokenDao({
                expiry_date: data.results.expiry_date,
                user_id: data.results.user_id,
                user_name: data.results.user.name
            });
            if (typeof generatedSessionToken === 'string') {
                req.token = generatedSessionToken;
                req.session = data.results;
                return next();
            }
            else {
                if (!generatedSessionToken) {
                    const errorResponse = Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError]), { message: 'Unable to generate a token.' });
                    return res.status(errorResponse.statusCode).json(errorResponse);
                }
                return res.status(generatedSessionToken.statusCode).json(generatedSessionToken);
            }
        }
        catch (err) {
            const response = Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError]), { message: "Something went wrong and we can't sign you in right now. Please try again later." });
            return res.status(response.statusCode).json(response);
        }
    });
    return {
        validateSession,
        validateAuthentication,
        validateImage
    };
};
//# sourceMappingURL=Middlewares.js.map
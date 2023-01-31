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
exports.useSessionService = void 0;
const encryption_1 = require("../constant/encryption");
const HttpConstant_1 = require("../constant/HttpConstant");
const SessionDao_1 = require("../dao/SessionDao");
const { getSession: getSessionDao, createSession: createSessionDao, extendSession: extendSessionDao, destroySession: destroySessionDao, verifySession: verifySessionDao, loginSession: loginSessionDao, checkIfSessionExists: checkIfSessionExistsDao } = SessionDao_1.useSessionDao();
exports.useSessionService = () => {
    const loginSession = (request) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield loginSessionDao(request.username);
            if (!data)
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: 'User not found.' });
            const hashedPassword = data.password || '';
            const userId = data.id;
            if (!(yield encryption_1.useHashCompare(request.password, hashedPassword)))
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.BadRequest]), { message: 'Invalid credential.' });
            const isSessionExists = yield checkIfSessionExistsDao(userId);
            if (!isSessionExists) {
                const isCreated = yield createSessionDao(userId);
                if (!isCreated)
                    return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError]), { message: 'Unable to create session' });
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success]), { id: userId });
            }
            else {
                const isUpdated = yield extendSessionDao(userId);
                if (!isUpdated)
                    return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError]), { message: 'Unable to update session' });
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success]), { id: userId });
            }
        }
        catch (err) {
            console.log('Error Service: loginSession -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const getSession = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const results = yield getSessionDao(userId);
            if (!results)
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError]), { message: 'No session found.' });
            return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success]), { results });
        }
        catch (err) {
            console.log('Error Service: getSession -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const logoutSession = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const isDestroy = yield destroySessionDao(userId);
            if (!isDestroy)
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError]), { message: 'Unable to destroy session.' });
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success];
        }
        catch (err) {
            console.log('Error Service: logoutSession -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const verifySession = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const isValid = yield verifySessionDao(userId);
            if (!isValid)
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Unauthorized]), { message: 'Session expired.' });
            const isSessionExtended = yield extendSessionDao(userId);
            if (!isSessionExtended)
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError]), { message: 'Unable to extend session expiry date.' });
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Success];
        }
        catch (err) {
            console.log('Error Service: verifySession -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    const generateSessionToken = (data) => {
        try {
            return encryption_1.useEncrypt(JSON.stringify(data));
        }
        catch (err) {
            console.log('Error Service: generateSessionToken -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    };
    const validateSessionToken = (token, keyToken) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const keyTokenDecrypted = encryption_1.useDecrypt(keyToken);
            if (token !== keyTokenDecrypted)
                return Object.assign(Object.assign({}, HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.Unauthorized]), { message: 'Authorization required.' });
            const tokenDecrypted = JSON.parse(encryption_1.useDecrypt(token));
            return yield verifySession(tokenDecrypted.user_id);
        }
        catch (err) {
            console.log('Error Service: validateSessionToken -> ', err);
            return HttpConstant_1.HTTP_RESPONSES[HttpConstant_1.HttpResponseType.ServerError];
        }
    });
    return {
        loginSession,
        getSession,
        logoutSession,
        generateSessionToken,
        validateSessionToken
    };
};
//# sourceMappingURL=UserSessionService.js.map
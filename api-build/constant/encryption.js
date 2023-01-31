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
exports.useDecrypt = exports.useEncrypt = exports.useHashCompare = exports.useHash = void 0;
const argon2_1 = __importDefault(require("argon2"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const config_1 = require("../config/config");
exports.useHash = (text) => __awaiter(void 0, void 0, void 0, function* () {
    return yield argon2_1.default.hash(text, { type: argon2_1.default.argon2id });
});
exports.useHashCompare = (text, hashedText) => __awaiter(void 0, void 0, void 0, function* () {
    return yield argon2_1.default.verify(hashedText, text);
});
exports.useEncrypt = (data) => {
    if (!config_1.CRYPTO_SECRET)
        return null;
    return crypto_js_1.default.AES.encrypt(data, config_1.CRYPTO_SECRET).toString();
};
exports.useDecrypt = (data) => {
    if (!config_1.CRYPTO_SECRET)
        return null;
    return crypto_js_1.default.AES.decrypt(data, config_1.CRYPTO_SECRET).toString(crypto_js_1.default.enc.Utf8);
};
//# sourceMappingURL=encryption.js.map
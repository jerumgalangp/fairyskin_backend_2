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
exports.connectDB = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("./config/config");
exports.connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const conn = yield typeorm_1.createConnection(config_1.ORM_CONFIG_PROD);
        console.log(`Database connection success. Connection name: '${conn.name}' `);
    }
    catch (err) {
        if (err.name === 'AlreadyHasActiveConnectionError') {
            const activeConnection = typeorm_1.getConnectionManager().get(config_1.ORM_CONFIG_PROD.name);
            return activeConnection;
        }
        console.log(err);
    }
    return null;
});
//# sourceMappingURL=connection.js.map
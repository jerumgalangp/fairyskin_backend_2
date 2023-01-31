"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORM_CONFIG_PROD = exports.ORM_CONFIG = exports.CRYPTO_SECRET = exports.SESSION_TIMEOUT = exports.ORM_DB_SCHEMA = exports.DATABASE_URL = exports.APP_ZONE = exports.APP_PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const APP_HOST = process.env.APP_HOST;
exports.APP_PORT = process.env.APP_PORT;
exports.APP_ZONE = process.env.APP_ZONE;
const ORM_SYNCHRONIZE = process.env.ORM_SYNCHRONIZE === 'true';
const ORM_LOGGING = process.env.ORM_LOGGING === 'true';
exports.DATABASE_URL = process.env.DATABASE_URL;
const ORM_DB_TYPE = process.env.ORM_DB_TYPE;
const ORM_DB_HOST = process.env.ORM_DB_HOST;
const ORM_DB_PORT = process.env.ORM_DB_PORT;
const ORM_DB_USERNAME = process.env.ORM_DB_USERNAME;
const ORM_DB_PASSWORD = process.env.ORM_DB_PASSWORD;
const ORM_DB_NAME = process.env.ORM_DB_NAME;
exports.ORM_DB_SCHEMA = process.env.APP_ZONE === 'production' ? `${process.env.APP_NAME}_production` : `${process.env.APP_NAME}_development`;
exports.SESSION_TIMEOUT = process.env.SESSION_TIMEOUT;
exports.CRYPTO_SECRET = process.env.CRYPTO_SECRET;
const SERVER_CONFIG = {
    app_host: APP_HOST,
    app_port: exports.APP_PORT,
    app_zone: exports.APP_ZONE,
    crypto_secret: exports.CRYPTO_SECRET
};
exports.ORM_CONFIG = {
    type: ORM_DB_TYPE,
    host: ORM_DB_HOST,
    port: ORM_DB_PORT,
    username: ORM_DB_USERNAME,
    password: ORM_DB_PASSWORD,
    database: ORM_DB_NAME,
    schema: exports.ORM_DB_SCHEMA,
    synchronize: ORM_SYNCHRONIZE,
    uuidExtension: 'pgcrypto',
    logging: ORM_LOGGING,
    entities: [path_1.default.join(__dirname, '../entities/*.*')],
    migrations: [path_1.default.join(__dirname, '../migrations/*.*')],
    cli: {
        migrationsDir: 'source/migrations'
    }
};
exports.ORM_CONFIG_PROD = {
    type: ORM_DB_TYPE,
    url: exports.DATABASE_URL,
    logging: ORM_LOGGING,
    uuidExtension: 'pgcrypto',
    extra: {
        ssl: {
            rejectUnauthorized: false
        }
    },
    entities: [path_1.default.join(__dirname, '../entities/*.*')],
    migrations: [path_1.default.join(__dirname, '../migrations/*.*')],
    cli: {
        migrationsDir: 'source/migrations'
    }
};
const config = {
    server: SERVER_CONFIG
};
exports.default = config;
//# sourceMappingURL=config.js.map
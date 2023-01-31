"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.configProd = exports.config = exports.TypeOrmConfig = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const winston_logger_1 = __importDefault(require("../../common/logger/winston.logger"));
const config_1 = require("./../config");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const ORM_DB_HOST = process.env.ORM_DB_HOST;
const ORM_DB_USERNAME = process.env.ORM_DB_USERNAME;
const ORM_DB_PASSWORD = process.env.ORM_DB_PASSWORD;
const ORM_DB_NAME = process.env.ORM_DB_NAME;
const DATABASE_URL = process.env.DATABASE_URL;
let TypeOrmConfig = class TypeOrmConfig {
    constructor() {
        this.logger = winston_logger_1.default;
    }
    connection() {
        return __awaiter(this, void 0, void 0, function* () {
            const configEnv = config_1.APP_ZONE === 'development' ? exports.config : exports.configProd;
            try {
                yield typeorm_1.createConnection(configEnv);
                this.logger.info('[TypeORM] Database connected 💾');
            }
            catch (err) {
                this.logger.error(`[TypeORM] Failed to connect: ${err} ❌`);
                process.exit(1);
            }
            return exports.config;
        });
    }
};
TypeOrmConfig = __decorate([
    inversify_1.injectable()
], TypeOrmConfig);
exports.TypeOrmConfig = TypeOrmConfig;
exports.config = {
    type: 'postgres',
    host: ORM_DB_HOST,
    username: ORM_DB_USERNAME,
    password: ORM_DB_PASSWORD,
    database: ORM_DB_NAME,
    synchronize: false,
    entities: [path_1.default.join(__dirname, 'dist/entities/*.*')],
    migrations: [path_1.default.join(__dirname, 'dist/migrations/*.*')],
    migrationsTableName: `migrations_${process.env.APP_ZONE}`,
    cli: {
        migrationsDir: 'source/migrations'
    }
};
exports.configProd = {
    type: 'postgres',
    url: DATABASE_URL,
    synchronize: false,
    entities: [path_1.default.join(__dirname, 'dist/entities/*.*')],
    migrations: [path_1.default.join(__dirname, 'dist/migrations/*.*')],
    migrationsTableName: `migrations_${process.env.APP_ZONE}`,
    cli: {
        migrationsDir: 'source/migrations'
    }
};
//# sourceMappingURL=typeorm.config.js.map
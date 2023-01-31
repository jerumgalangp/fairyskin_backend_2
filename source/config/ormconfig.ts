import dotenv from 'dotenv';
import path from 'path';

import { ConnectionOptions } from 'typeorm';

dotenv.config();

/* APP */
export const APP_PORT = process.env.APP_PORT;
export const APP_ZONE = process.env.APP_ZONE;

/* ORM */
const ORM_SYNCHRONIZE = process.env.ORM_SYNCHRONIZE === 'true';
const ORM_LOGGING = process.env.ORM_LOGGING === 'true';

/* DB */
const ORM_DB_TYPE = process.env.ORM_DB_TYPE;
const ORM_DB_HOST = process.env.ORM_DB_HOST;
const ORM_DB_PORT = process.env.ORM_DB_PORT;
const ORM_DB_USERNAME = process.env.ORM_DB_USERNAME;
const ORM_DB_PASSWORD = process.env.ORM_DB_PASSWORD;
const ORM_DB_NAME = process.env.ORM_DB_NAME;
const PROD_DB_URL = process.env.DATABASE_URL;
export const ORM_DB_SCHEMA = process.env.APP_ZONE === 'production' ? `${process.env.APP_NAME}_production` : `${process.env.APP_NAME}_development`;

export const SESSION_TIMEOUT = process.env.SESSION_TIMEOUT;
/* CRYPTO */
export const CRYPTO_SECRET = process.env.CRYPTO_SECRET;

dotenv.config();

const devConfig = {
    type: ORM_DB_TYPE,
    host: ORM_DB_HOST,
    port: ORM_DB_PORT,
    username: ORM_DB_USERNAME,
    password: ORM_DB_PASSWORD,
    database: ORM_DB_NAME,
    synchronize: ORM_SYNCHRONIZE,
    logging: ORM_LOGGING,
    entities: [path.join(__dirname, '../entities/*.*')],
    migrations: [path.join(__dirname, '../migrations/*.*')],
    cli: {
        entitiesDir: path.join(__dirname, '../entities'),
        migrationsDir: path.join(__dirname, '../migrations')
    }
} as ConnectionOptions;

const prodConfig = {
    type: ORM_DB_TYPE,
    url: PROD_DB_URL,
    logging: false,
    ssl: { rejectUnauthorized: false },
    entities: [path.join(__dirname, '../entities/*.*')],
    migrations: [path.join(__dirname, '../migrations/*.*')],
    cli: {
        entitiesDir: path.join(__dirname, '../entities'),
        migrationsDir: path.join(__dirname, '../migrations')
    }
} as ConnectionOptions;

export default process.env.APP_ZONE === 'production' ? prodConfig : devConfig;

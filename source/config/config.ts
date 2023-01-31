import dotenv from 'dotenv';
import path from 'path';
import { createConnection } from 'typeorm';

dotenv.config();

/* APP */
const APP_HOST = process.env.APP_HOST;
export const APP_PORT = process.env.APP_PORT;
export const APP_ZONE = process.env.APP_ZONE;

/* ORM */
const ORM_SYNCHRONIZE = process.env.ORM_SYNCHRONIZE === 'true';
const ORM_LOGGING = process.env.ORM_LOGGING === 'true';

export const DATABASE_URL = process.env.DATABASE_URL;

/* DB */
const ORM_DB_TYPE = process.env.ORM_DB_TYPE;
const ORM_DB_HOST = process.env.ORM_DB_HOST;
const ORM_DB_PORT = process.env.ORM_DB_PORT;
const ORM_DB_USERNAME = process.env.ORM_DB_USERNAME;
const ORM_DB_PASSWORD = process.env.ORM_DB_PASSWORD;
const ORM_DB_NAME = process.env.ORM_DB_NAME;
export const ORM_DB_SCHEMA = process.env.APP_ZONE === 'production' ? `${process.env.APP_NAME}_production` : `${process.env.APP_NAME}_development`;

export const SESSION_TIMEOUT = process.env.SESSION_TIMEOUT;
/* CRYPTO */
export const CRYPTO_SECRET = process.env.CRYPTO_SECRET;

const SERVER_CONFIG = {
    app_host: APP_HOST,
    app_port: APP_PORT,
    app_zone: APP_ZONE,
    crypto_secret: CRYPTO_SECRET
};

export const ORM_CONFIG = {
    type: ORM_DB_TYPE,
    host: ORM_DB_HOST,
    port: ORM_DB_PORT,
    username: ORM_DB_USERNAME,
    password: ORM_DB_PASSWORD,
    database: ORM_DB_NAME,
    schema: ORM_DB_SCHEMA,
    synchronize: ORM_SYNCHRONIZE,
    uuidExtension: 'pgcrypto',
    logging: ORM_LOGGING,
    entities: [path.join(__dirname, '../entities/*.*')],
    migrations: [path.join(__dirname, '../migrations/*.*')],
    cli: {
        migrationsDir: 'source/migrations'
    }
} as Parameters<typeof createConnection>[0];

export const ORM_CONFIG_PROD = {
    type: ORM_DB_TYPE,
    url: DATABASE_URL,
    logging: ORM_LOGGING,
    uuidExtension: 'pgcrypto',
    extra: {
        ssl: {
            rejectUnauthorized: false
        }
    },
    entities: [path.join(__dirname, '../entities/*.*')],
    migrations: [path.join(__dirname, '../migrations/*.*')],
    cli: {
        migrationsDir: 'source/migrations'
    }
} as Parameters<typeof createConnection>[0];

const config = {
    server: SERVER_CONFIG
};

export default config;

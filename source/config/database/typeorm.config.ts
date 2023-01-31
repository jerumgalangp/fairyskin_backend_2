import { injectable } from 'inversify';
import { ConnectionOptions, createConnection, DatabaseType } from 'typeorm';
import Logger from '../../common/logger/winston.logger';
import { APP_ZONE } from './../config';

import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const ORM_DB_HOST = process.env.ORM_DB_HOST;
const ORM_DB_USERNAME = process.env.ORM_DB_USERNAME;
const ORM_DB_PASSWORD = process.env.ORM_DB_PASSWORD;
const ORM_DB_NAME = process.env.ORM_DB_NAME;
const DATABASE_URL = process.env.DATABASE_URL;

@injectable()
export class TypeOrmConfig {
    private logger = Logger;

    public async connection(): Promise<any> {
        const configEnv = APP_ZONE === 'development' ? config : configProd;

        try {
            await createConnection(configEnv);
            this.logger.info('[TypeORM] Database connected 💾');
        } catch (err) {
            this.logger.error(`[TypeORM] Failed to connect: ${err} ❌`);
            process.exit(1);
        }

        return config;
    }
}

export const config: ConnectionOptions = <ConnectionOptions>{
    type: <DatabaseType>'postgres',
    host: ORM_DB_HOST,
    username: ORM_DB_USERNAME,
    password: ORM_DB_PASSWORD,
    database: ORM_DB_NAME,
    synchronize: false,
    entities: [path.join(__dirname, 'dist/entities/*.*')],
    migrations: [path.join(__dirname, 'dist/migrations/*.*')],
    migrationsTableName: `migrations_${process.env.APP_ZONE}`,
    cli: {
        migrationsDir: 'source/migrations'
    }
};

export const configProd: ConnectionOptions = <ConnectionOptions>{
    type: <DatabaseType>'postgres',
    url: DATABASE_URL,
    synchronize: false,
    entities: [path.join(__dirname, 'dist/entities/*.*')],
    migrations: [path.join(__dirname, 'dist/migrations/*.*')],
    migrationsTableName: `migrations_${process.env.APP_ZONE}`,
    cli: {
        migrationsDir: 'source/migrations'
    }
};

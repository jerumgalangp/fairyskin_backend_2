require('dotenv').config();
const path = require('path');

module.exports = {
    type: process.env.ORM_DB_TYPE,
    host: process.env.ORM_DB_HOST,
    port: process.env.ORM_DB_PORT,
    username: process.env.ORM_DB_USERNAME,
    password: process.env.ORM_DB_PASSWORD,
    database: process.env.ORM_DB_NAME,
    schema: process.env.APP_ZONE === 'production' ? `${process.env.APP_NAME}_production` : `${process.env.APP_NAME}_development`,
    synchronize: process.env.ORM_SYNCHRONIZE,
    extra: {
        ssl: {
            rejectUnauthorized: false
        }
    },
    //name: 'default',
    logging: true,
    entities: [path.join(__dirname, 'api-build/entities/*.*')],
    migrations: [path.join(__dirname, 'api-build/migrations/*.*')],
    migrationsTableName: `migrations_${process.env.APP_ZONE}`,
    cli: {
        migrationsDir: 'source/migrations'
    }
};

import { Connection, createConnection, getConnectionManager } from 'typeorm';
import { ORM_CONFIG_PROD } from './config/config';

// export const connectDB = async () => {
//     // const configEnv = APP_ZONE === 'development' ? ORM_CONFIG : ORM_CONFIG_PROD;
//     //Logger.info(`FAIRY SKIN API Configuration Environment : ${APP_ZONE}`);
//     logging.info('', '', `FAIRY SKIN API Configuration Environment : ${process.env.APP_ZONE}`);
//     await createConnection(ORM_CONFIG_PROD);
//     //Logger.info(`FAIRY SKIN API Successfully Connected to Database : ${configEnv.database}`);
// };

export const connectDB = async (): Promise<Connection | null> => {
    try {
        const conn = await createConnection(ORM_CONFIG_PROD);
        console.log(`Database connection success. Connection name: '${conn.name}' `);
    } catch (err) {
        if (err.name === 'AlreadyHasActiveConnectionError') {
            const activeConnection = getConnectionManager().get(ORM_CONFIG_PROD.name);
            return activeConnection;
        }
        console.log(err);
    }
    return null;
};

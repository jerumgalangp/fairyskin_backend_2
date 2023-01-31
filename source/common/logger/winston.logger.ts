import winston from 'winston';
import { APP_ZONE } from '../../config/config';

const transports = [];
if (APP_ZONE !== 'development') {
    transports.push(new winston.transports.Console());
} else {
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(winston.format.cli(), winston.format.splat())
        })
    );
}

const Logger = winston.createLogger({
    level: 'silly',
    levels: winston.config.npm.levels,
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    transports
});

export default Logger;

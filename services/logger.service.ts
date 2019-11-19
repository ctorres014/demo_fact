import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

export const logger = createLogger({
    format: combine(
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.File({
            filename: './logs/combined.log',
            level: 'info'
        }),
        new transports.File({
            filename: './logs/errors.log',
            level: 'error'
        }),
        new transports.Console()]
});

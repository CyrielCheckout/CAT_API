const winston = require('winston');
const { format } = require('logform');
require('winston-daily-rotate-file');
const { combine, timestamp, label, printf, json, colorize, align, errors } = format;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};
const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/logs-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
});
const loggerInfo = winston.createLogger({
  level: 'info',
  label: 'CAT_API',
  levels :levels,
  format: combine(
    errors({ stack: true }),
    timestamp({format: 'YYYY-MM-DD hh:mm:ss.SSS'}),
    align(),
    printf((info) => `[${info.timestamp} ${info.label}] ${info.level}: ${info.message}`),
    json()
  ),
  //defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    fileRotateTransport,
    new winston.transports.File({ filename: 'logs/Backend_Info.log', level: 'info' }),
  ],
});
const loggerError = winston.createLogger({
  level: 'error',
  label: 'CAT_API',
  levels :levels,
  format: combine(
    errors({ stack: true }),
    timestamp({format: 'YYYY-MM-DD hh:mm:ss.SSS'}),
    align(),
    printf((error) => `[${error.timestamp} ${error.label}] ${error.level}: ${error.message}`),
    json()
  ),
  //defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    fileRotateTransport,
    new winston.transports.File({ filename: 'logs/Backend_Errors.log', level: 'error' }),
    new winston.transports.Console()
  ],
});

module.exports = {
  loggerInfo,
  loggerError
}
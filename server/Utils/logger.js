const winston = require('winston');
const { format } = require('logform');
const { combine, timestamp, label, printf } = format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});
const logger = winston.createLogger({
  level: 'info',
  format: combine(
    label({ label: 'CAT_API' }),
    timestamp(),
    myFormat
  ),
  //defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'logs/Backend_Errors.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/Backend_Info.log', level: 'info' }),
    new winston.transports.Console()
  ],
});

module.exports = {logger}
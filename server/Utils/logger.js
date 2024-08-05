const winston = require('winston');
const { format } = require('logform');
require('winston-daily-rotate-file');
const { combine, timestamp, label, printf, json, colorize, align, errors, prettyPrint } = format;

const customFormat = printf(({ timestamp, user, level, message, source, CorrelationID, PID, IPADD, ...metadata }) => {
  return JSON.stringify({
    timestamp,
    level,
    message,
    source,
    user,
    CorrelationID,
    PID,
    IPADD,
    CATENV,
    ...metadata
  });
});

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
const logger = winston.createLogger({
  level: 'info',
  //label: 'CAT_API',
  levels: levels,
  format: combine(
    //errors({ stack: false }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format((info) => {
      info.source = info.source;
      info.user = DecodedJWT.payload.full_name;
      info.CorrelationID = CorrelationID;
      info.PID = process.pid;
      if (typeof Addresse_IP !== 'undefined' && Addresse_IP !== undefined) {
        info.IPADD = Addresse_IP;
      }
      info.CATENV = CATENV
      return info;
    })(),
    customFormat
    //align(),
    //format.printf((info) => `${info.timestamp} - ${DecodedJWT.payload.full_name} : ${info.level}: ${JSON.stringify(info.message)} - ${CorrelationID} - [${process.platform},${process.pid}]`),
    //format.printf((info) => `{\"Timestamp\" : \"${info.timestamp}\", \"User\" : \"${DecodedJWT.payload.full_name}\", \"Level\" : \"${info.level}\",\"Data\" :${JSON.stringify(info.message)}, \"CorrelationID\": \"${CorrelationID}\", \"ProcessID\" : \"${process.pid}\"}`),
    //printf((info) => `${info.timestamp}, ${info.User}, ${info.level}], ${info.message},${info.status}, ${info.source}`),
    //json(),
    //prettyPrint()
  ),
  //defaultMeta: { service: 'user-service' },
  transports: [
    //
    //
    fileRotateTransport,
    /*new winston.transports.Console({
      format: combine(
        //errors({ stack: false }),
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS' }),
        format.printf((info) => `${info.timestamp} - ${DecodedJWT.payload.full_name} : ${info.level}: ${JSON.stringify(info.message)} - ${CorrelationID} - [${process.platform},${process.pid}]`),
        prettyPrint(),
        colorize({all:true})
      )
    })*/
    //new winston.transports.File({ filename: 'logs/Backend_Info.log', level: 'info' }),
  ],
});
/*const loggerError = winston.createLogger({
  level: 'error',
 // label: 'CAT_API',
  levels :levels,
  format: combine(
    errors({ stack: false }),
    timestamp({format: 'YYYY-MM-DD hh:mm:ss.SSS'}),
    align(),
    format.printf((error) => `${info.timestamp} ${info.level}: ${info.message}`),
    printf((error) => `[${error.timestamp}, ${error.User}, ${error.level}], ${error.message},${error.HTTP_Status_Code},${error.status}, ${error.source}`),
    json(),
    //prettyPrint()
  ),
  //defaultMeta: { service: 'user-service' },
  transports: [
    //
    //
    fileRotateTransport,
    //new winston.transports.File({ filename: 'logs/Backend_Errors.log', level: 'error' }),
    //new winston.transports.Console()
  ],
});*/

module.exports = {
  logger,
  //loggerError
}
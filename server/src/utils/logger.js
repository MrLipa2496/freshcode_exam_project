const winston = require('winston');
const path = require('path');

const logFormat = winston.format.printf(
  ({ message, timestamp, code, stack }) => {
    return JSON.stringify({
      message,
      time: timestamp,
      code: code || 500,
      stackTrace: stack || 'No stack trace',
    });
  }
);

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: path.join(__dirname, 'logs/error.log'),
    }),
  ],
});

const logError = error => {
  logger.error({
    message: error.message,
    code: error.code || 500,
    stack: error.stack,
  });
};

module.exports = logError;

const winston = require('winston');
const path = require('path');

const logFormat = winston.format.printf(
  ({ message, timestamp, code, stack }) => {
    return JSON.stringify({
      message,
      time: new Date(timestamp).getTime(),
      code,
      stackTrace: stack || {},
    });
  }
);

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [
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

const ApplicationError = require('./ApplicationError');
const logError = require('../utils/logger');

class ServerError extends ApplicationError {
  constructor (message) {
    super(message || 'server error', 500);

    logError({
      message: this.message,
      time: Date.now(),
      code: this.code,
      stackTrace: this.stack,
    });
  }
}

module.exports = ServerError;

const logError = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logError(err);
  res
    .status(err.code || 500)
    .json({ message: err.message || 'Internal Server Error' });
};

module.exports = errorHandler;

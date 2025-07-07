const logError = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logError(err);

  if (
    err.message ===
      'new row for relation "Banks" violates check constraint "Banks_balance_ck"' ||
    err.message ===
      'new row for relation "Users" violates check constraint "Users_balance_ck"'
  ) {
    err.message = 'Not Enough money';
    err.code = 406;
  }

  const status = err.code || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({ message });
};

module.exports = errorHandler;

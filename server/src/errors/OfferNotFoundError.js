const ApplicationError = require('./ApplicationError');

class OfferNotFoundError extends ApplicationError {
  constructor (message) {
    super(message || 'Offer not found', 404);
  }
}

module.exports = OfferNotFoundError;

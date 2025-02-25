const bd = require('../../models');
const NotFound = require('../../errors/OfferNotFoundError');
const ServerError = require('../../errors/ServerError');

module.exports.updateOfferStatus = async (data, offerId, transaction) => {
  const offer = await bd.Offers.findOne({
    where: { id: offerId },
    transaction,
  });

  if (!offer) {
    throw new NotFound('Offer not found');
  }

  if (offer.status !== 'pending') {
    throw new ServerError('Offer must be in pending status to be moderated');
  }

  const [updatedCount, [updatedOffer]] = await bd.Offers.update(data, {
    where: { id: offerId },
    returning: true,
    transaction,
  });

  if (updatedCount !== 1) {
    throw new ServerError('Cannot update offer');
  }

  return updatedOffer.dataValues;
};

module.exports.findOffer = async (predicate, transaction) => {
  const result = await bd.Offers.findOne({ where: predicate, transaction });
  if (!result) {
    throw new NotFound('Offer not found');
  } else {
    return result.get({ plain: true });
  }
};

module.exports.getUserById = async (userId, transaction) => {
  const user = await bd.Users.findOne({ where: { id: userId }, transaction });
  if (!user) {
    throw new NotFound('User not found');
  }
  return user;
};

module.exports.getAllOffers = async (offset, limit) => {
  const result = await bd.Offers.findAndCountAll({
    where: { status: 'pending' },
    limit,
    offset,
    order: [['id', 'DESC']],
  });

  return result;
};

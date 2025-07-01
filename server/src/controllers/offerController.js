const bd = require('../models');
const offerQueries = require('./queries/offerQueries');
const { sendOfferStatusMail } = require('../utils/emailService');

module.exports.getPendingOffers = async (req, res, next) => {
  try {
    let { page = 1, pageSize = 5 } = req.query;

    page = parseInt(page, 10);
    pageSize = parseInt(pageSize, 10);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(pageSize) || pageSize < 1 || pageSize > 100) pageSize = 5;

    const offset = (page - 1) * pageSize;
    const limit = pageSize;

    const { rows: offers, count } = await offerQueries.getAllOffers(
      offset,
      limit
    );

    const pendingOffers = offers.filter(offer => offer.status === 'pending');

    res.send({
      offers: pendingOffers.map(offer => ({
        id: offer.id,
        userId: offer.userId,
        contestId: offer.contestId,
        text: offer.text,
        fileName: offer.fileName,
        originalFileName: offer.originalFileName,
        status: offer.status,
      })),
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
      totalOffers: count,
    });
  } catch (err) {
    console.error('Error fetching pending offers:', err);
    next(err);
  }
};

module.exports.updateOfferStatus = async (req, res, next) => {
  const transaction = await bd.sequelize.transaction();

  try {
    const { id } = req.params;
    let { status } = req.body;

    if (status === 'rejected') {
      status = 'rejected_by_moderator';
    }

    if (
      !['approved_by_moderator', 'rejected', 'rejected_by_moderator'].includes(
        status
      )
    ) {
      return res.status(400).send({ message: 'Invalid status update' });
    }

    const offer = await offerQueries.findOffer({ id }, transaction);
    if (!offer) {
      return res.status(404).send({ message: 'Offer not found' });
    }

    if (offer.status !== 'pending') {
      return res
        .status(400)
        .send({ message: 'Offer must be in pending status to be moderated' });
    }

    const updatedOffer = await offerQueries.updateOfferStatus(
      { status },
      id,
      transaction
    );

    const user = await offerQueries.getUserById(offer.userId, transaction);

    await sendOfferStatusMail(
      user.firstName,
      user.email,
      updatedOffer.text,
      status
    );

    await transaction.commit();

    res.send({
      id: updatedOffer.id,
      userId: updatedOffer.userId,
      contestId: updatedOffer.contestId,
      text: updatedOffer.text,
      fileName: updatedOffer.fileName,
      originalFileName: updatedOffer.originalFileName,
      status: updatedOffer.status,
    });
  } catch (err) {
    if (transaction) await transaction.rollback();
    next(err);
  }
};

const _ = require('lodash');
const db = require('../models');
const controller = require('../socketInit');
const chatQueries = require('./queries/chatQueries');

module.exports.getChat = async (req, res, next) => {
  const currentUserId = req.tokenData.userId;
  const interlocutorId = req.body.interlocutorId;

  const participants = [currentUserId, interlocutorId];
  const uniqueParticipants = [...new Set(participants)];

  try {
    let conversation = await chatQueries.findConversation(uniqueParticipants);

    let blackList = [];
    let favoriteList = [];

    if (!conversation) {
      const created = await chatQueries.createConversation(uniqueParticipants);
      conversation = created.conversation;
      blackList = created.blackList;
      favoriteList = created.favoriteList;
    } else {
      blackList = conversation.blackList || [];
      favoriteList = conversation.favoriteList || [];
    }

    const messages = await chatQueries.findMessages(conversation.id);
    const interlocutor = await chatQueries.findInterlocutor(interlocutorId);

    if (!interlocutor) {
      return res.status(404).send({ message: 'No interlocutor found' });
    }

    res.send({
      chatData: {
        id: conversation.id,
        participants: uniqueParticipants,
        blackList,
        favoriteList,
      },
      messages,
      interlocutor: {
        firstName: interlocutor.firstName,
        lastName: interlocutor.lastName,
        displayName: interlocutor.displayName,
        id: interlocutor.id,
        avatar: interlocutor.avatar,
      },
    });
  } catch (err) {
    console.error('Error in getChat:', err);
    next(err);
  }
};

module.exports.getPreview = async (req, res, next) => {
  try {
    const userId = req.tokenData.userId;

    const previewData = await chatQueries.getConversationPreview(userId);

    res.send(previewData);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

module.exports.addMessage = async (req, res, next) => {
  const senderId = Number(req.tokenData.userId);
  const recipientId = Number(req.body.recipient);
  const messageBody = req.body.messageBody;

  const participantsSorted = [senderId, recipientId].sort((a, b) => a - b);

  try {
    let conversationData = await chatQueries.findConversationByParticipants(
      participantsSorted
    );

    if (!conversationData) {
      conversationData = await chatQueries.findConversationByParticipants(
        participantsSorted
      );
      if (!conversationData) {
        conversationData = await chatQueries.createConversation(
          participantsSorted
        );
      }
    }

    const { conversation, blackList, favoriteList } = conversationData;

    const message = await chatQueries.createMessage({
      sender_id: senderId,
      body: messageBody,
      conversation_id: conversation.id,
    });

    const participantsForSender = [senderId, recipientId];
    const participantsForRecipient = [recipientId, senderId];

    controller.getChatController().emitNewMessage(recipientId, {
      message: {
        ...message.get({ plain: true }),
        participants: participantsForRecipient,
      },
      preview: {
        _id: conversation.id,
        sender: senderId,
        text: messageBody,
        createdAt: message.createdAt,
        participants: participantsForRecipient,
        blackList,
        favoriteList,
        interlocutor: {
          id: senderId,
          firstName: req.tokenData.firstName,
          lastName: req.tokenData.lastName,
          displayName: req.tokenData.displayName,
          avatar: req.tokenData.avatar,
          email: req.tokenData.email,
        },
      },
    });

    res.send({
      message: {
        ...message.get({ plain: true }),
        participants: participantsForSender,
      },
      preview: {
        _id: conversation.id,
        sender: senderId,
        text: messageBody,
        createdAt: message.createdAt,
        participants: participantsForSender,
        blackList,
        favoriteList,
        interlocutor: {
          id: recipientId,
          firstName: req.body.interlocutor.firstName,
          lastName: req.body.interlocutor.lastName,
          displayName: req.body.interlocutor.displayName,
          avatar: req.body.interlocutor.avatar,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports.blackList = async (req, res, next) => {
  const userId = req.tokenData.userId;
  const { participants, blackListFlag } = req.body;

  const participantIds = participants.map(p =>
    typeof p === 'object' ? p.id : p
  );
  const interlocutorId = participantIds.find(id => id !== userId);

  if (!interlocutorId) {
    return res.status(400).send({ message: 'Could not find interlocutor' });
  }

  try {
    const chat = await chatQueries.getConversationByParticipants(
      participantIds
    );

    if (!chat) {
      return res.status(404).send({ message: 'Conversation not found' });
    }

    const updatedBlackListFlag = !blackListFlag;
    await chatQueries.updateBlackListStatus(
      chat.id,
      userId,
      updatedBlackListFlag
    );

    const allParticipants = await chatQueries.getParticipantsByConversationId(
      chat.id
    );

    const sorted = [userId, interlocutorId];
    const participantMap = new Map();
    allParticipants.forEach(p => {
      participantMap.set(p.user_id, {
        blacklisted: p.blacklisted,
        favorited: p.favorited,
      });
    });

    res.send({
      _id: chat.id,
      participants: sorted,
      blackList: sorted.map(id => participantMap.get(id).blacklisted),
      favoriteList: sorted.map(id => participantMap.get(id).favorited),
    });

    controller.getChatController().emitChangeBlockStatus(interlocutorId, chat);
  } catch (err) {
    next(err);
  }
};

module.exports.favoriteChat = async (req, res, next) => {
  const userId = req.tokenData.userId;
  const { participants } = req.body;

  const participantIds = participants.map(p =>
    typeof p === 'object' ? p.id : p
  );
  const interlocutorId = participantIds.find(id => id !== userId);

  if (!interlocutorId) {
    return res.status(400).send({ message: 'Could not find interlocutor' });
  }

  try {
    const chat = await chatQueries.getConversationByParticipants(
      participantIds
    );

    if (!chat) {
      return res.status(404).send({ message: 'Conversation not found' });
    }

    await chatQueries.updateFavoriteStatus(chat.id, userId);

    const updatedParticipants =
      await chatQueries.getParticipantsByConversationId(chat.id);

    const sorted = [userId, interlocutorId];
    const participantMap = new Map();
    updatedParticipants.forEach(p => {
      participantMap.set(p.user_id, {
        blacklisted: p.blacklisted,
        favorited: p.favorited,
      });
    });

    res.send({
      _id: Number(chat.id),
      participants: sorted,
      blackList: sorted.map(id => participantMap.get(id).blacklisted),
      favoriteList: sorted.map(id => participantMap.get(id).favorited),
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getCatalogs = async (req, res, next) => {
  try {
    const catalogs = await chatQueries.getCatalogsByUserId(
      req.tokenData.userId
    );
    res.send(catalogs);
  } catch (err) {
    next(err);
  }
};

module.exports.createCatalog = async (req, res, next) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { catalogName, chatId } = req.body;
    const userId = req.tokenData.userId;

    const formattedCatalog = await chatQueries.createCatalog(
      userId,
      catalogName,
      chatId,
      transaction
    );

    await transaction.commit();
    res.status(201).json(formattedCatalog);
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

module.exports.updateNameCatalog = async (req, res, next) => {
  try {
    const updatedCatalog = await chatQueries.updateCatalogName(
      req.body.catalogId,
      req.tokenData.userId,
      req.body.catalogName
    );

    if (!updatedCatalog) {
      return res.status(404).json({ message: 'Catalog not found' });
    }

    res.send(updatedCatalog);
  } catch (err) {
    next(err);
  }
};

module.exports.addNewChatToCatalog = async (req, res, next) => {
  try {
    const result = await chatQueries.addChatToCatalog(
      req.body.catalogId,
      req.tokenData.userId,
      req.body.chatId
    );
    if (!result) return res.status(404).send({ message: 'Catalog not found' });
    res.send(result);
  } catch (err) {
    next(err);
  }
};

module.exports.removeChatFromCatalog = async (req, res, next) => {
  try {
    const catalog = await chatQueries.removeChatFromCatalog(
      req.body.catalogId,
      req.body.chatId,
      req.tokenData.userId
    );

    if (!catalog)
      return res
        .status(404)
        .send({ message: 'Catalog not found or chat not linked' });

    res.send(catalog);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCatalog = async (req, res, next) => {
  try {
    const deleted = await chatQueries.deleteCatalog(
      req.body.catalogId,
      req.tokenData.userId
    );
    if (!deleted) return res.status(404).send({ message: 'Catalog not found' });
    res.end();
  } catch (err) {
    next(err);
  }
};

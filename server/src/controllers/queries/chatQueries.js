const { Op, Sequelize } = require('sequelize');
const bd = require('../../models');
const NotFound = require('../../errors/OfferNotFoundError');
const ServerError = require('../../errors/ServerError');

module.exports.findConversation = async participantIds => {
  const conversations = await bd.Conversations.findAll({
    include: [
      {
        model: bd.ConversationParticipants,
        as: 'participants',
        attributes: ['user_id'],
      },
    ],
  });

  for (const convo of conversations) {
    const users = convo.participants.map(p => p.user_id).sort((a, b) => a - b);
    const target = [...new Set(participantIds)].sort((a, b) => a - b);

    if (
      users.length === target.length &&
      users.every((id, index) => id === target[index])
    ) {
      return convo;
    }
  }

  return null;
};

module.exports.createConversation = async participants => {
  const sortedParticipants = [...participants].sort((a, b) => a - b);

  const conversation = await bd.Conversations.create();

  await Promise.all(
    sortedParticipants.map(userId =>
      bd.ConversationParticipants.create({
        conversation_id: conversation.id,
        user_id: userId,
        blacklisted: false,
        favorited: false,
      })
    )
  );

  const members = await bd.ConversationParticipants.findAll({
    where: { conversation_id: conversation.id },
    order: [['user_id', 'ASC']],
  });

  return {
    conversation,
    blackList: members.map(m => m.blacklisted),
    favoriteList: members.map(m => m.favorited),
  };
};

module.exports.findMessages = async conversationId => {
  try {
    return await bd.Messages.findAll({
      where: {
        conversation_id: conversationId,
      },
      order: [['createdAt', 'ASC']],
      attributes: [
        'id',
        'sender_id',
        'body',
        'conversation_id',
        'createdAt',
        'updatedAt',
      ],
    });
  } catch (err) {
    throw new Error('Error finding messages');
  }
};

module.exports.findInterlocutor = async interlocutorId => {
  try {
    return await bd.Users.findOne({
      where: { id: interlocutorId },
      attributes: ['id', 'firstName', 'lastName', 'displayName', 'avatar'],
    });
  } catch (err) {
    throw new Error('Error finding interlocutor');
  }
};

module.exports.getConversationPreview = async userId => {
  const lastMessages = await bd.Messages.findAll({
    include: [
      {
        model: bd.Conversations,
        as: 'conversation',
        include: [
          {
            model: bd.ConversationParticipants,
            as: 'participants',
            attributes: ['user_id', 'blacklisted', 'favorited'],
            include: [
              {
                model: bd.Users,
                as: 'User',
                attributes: [
                  'id',
                  'firstName',
                  'lastName',
                  'displayName',
                  'avatar',
                ],
              },
            ],
          },
        ],
        required: true,
      },
    ],
    attributes: ['id', 'sender_id', 'body', 'conversation_id', 'createdAt'],
    order: [['createdAt', 'DESC']],
  });

  const seen = new Set();
  const previews = [];

  for (const msg of lastMessages) {
    const convId = msg.conversation_id;
    if (seen.has(convId)) continue;
    seen.add(convId);

    const conversation = msg.conversation;
    const participantsList = conversation.participants.map(p => +p.user_id);
    if (!participantsList.includes(userId)) continue;

    const otherUserId = participantsList.find(id => id !== userId);
    const normalizedParticipants = [userId, otherUserId];

    const participantMap = new Map();
    conversation.participants.forEach(p => {
      participantMap.set(+p.user_id, {
        blacklisted: p.blacklisted,
        favorited: p.favorited,
      });
    });

    const blackList = normalizedParticipants.map(
      id => participantMap.get(id)?.blacklisted ?? false
    );
    const favoriteList = normalizedParticipants.map(
      id => participantMap.get(id)?.favorited ?? false
    );

    const interlocutor = conversation.participants.find(
      p => +p.user_id === +otherUserId
    )?.User;

    previews.push({
      _id: conversation.id,
      sender: msg.sender_id,
      text: msg.body,
      createAt: msg.createdAt,
      participants: normalizedParticipants,
      blackList,
      favoriteList,
      interlocutor: interlocutor
        ? {
            id: interlocutor.id,
            firstName: interlocutor.firstName,
            lastName: interlocutor.lastName,
            displayName: interlocutor.displayName,
            avatar: interlocutor.avatar,
          }
        : null,
    });
  }

  return previews;
};

module.exports.findConversationByParticipants = async participants => {
  const sortedParticipants = participants.map(Number).sort((a, b) => a - b);

  const conversationsByUser = await Promise.all(
    sortedParticipants.map(userId =>
      bd.ConversationParticipants.findAll({
        where: { user_id: userId },
        attributes: ['conversation_id'],
      })
    )
  );

  const conversationIdSets = conversationsByUser.map(res =>
    res.map(row => row.conversation_id)
  );

  if (conversationIdSets.some(arr => arr.length === 0)) return null;

  const commonConversationIds = conversationIdSets.reduce((acc, curr) =>
    acc.filter(id => curr.includes(id))
  );

  for (const id of commonConversationIds) {
    const members = await bd.ConversationParticipants.findAll({
      where: { conversation_id: id },
      attributes: ['user_id', 'blacklisted', 'favorited'],
      order: [['user_id', 'ASC']],
    });

    const memberIds = members.map(m => Number(m.user_id));
    const isMatch =
      memberIds.length === sortedParticipants.length &&
      memberIds.every((val, idx) => val === sortedParticipants[idx]);

    if (isMatch) {
      const conversation = await bd.Conversations.findByPk(id);
      return {
        conversation,
        blackList: members.map(m => m.blacklisted),
        favoriteList: members.map(m => m.favorited),
      };
    }
  }

  return null;
};

module.exports.createMessage = async ({ sender_id, body, conversation_id }) => {
  return await bd.Messages.create({
    sender_id,
    body,
    conversation_id,
  });
};

module.exports.getConversationByParticipants = async participants => {
  try {
    participants = participants.map(p => (typeof p === 'object' ? p.id : +p));

    participants = [...new Set(participants)];

    const chatCandidates = await bd.Conversations.findAll({
      include: [
        {
          model: bd.ConversationParticipants,
          as: 'participants',
          where: {
            user_id: {
              [Sequelize.Op.in]: participants,
            },
          },
          required: true,
        },
      ],
    });

    const matchedChat = chatCandidates.find(chat => {
      const ids = chat.participants.map(p => +p.user_id).sort();
      const expected = [...participants].sort();
      return (
        ids.length === expected.length &&
        ids.every((id, i) => id === expected[i])
      );
    });

    return matchedChat || null;
  } catch (err) {
    throw new Error('Error fetching conversation: ' + err.message);
  }
};

module.exports.getParticipantsByConversationId = async conversationId => {
  try {
    const participants = await bd.ConversationParticipants.findAll({
      where: {
        conversation_id: conversationId,
      },
      include: [
        {
          model: bd.Users,
          as: 'User',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          required: false,
        },
      ],
      raw: true,
      nest: true,
    });

    if (!participants.length) {
      throw new Error(
        `No participants found for conversation ${conversationId}`
      );
    }

    return participants;
  } catch (err) {
    throw new Error('Error retrieving participants: ' + err.message);
  }
};

module.exports.updateBlackListStatus = async (
  conversationId,
  userId,
  blackListFlag
) => {
  try {
    const chat = await bd.Conversations.findOne({
      where: { id: conversationId },
      include: [
        {
          model: bd.ConversationParticipants,
          as: 'participants',
          where: { user_id: userId },
        },
      ],
    });

    if (!chat) {
      throw new NotFound('Chat not found');
    }

    const participant = chat.participants.find(
      participant => participant.user_id === userId
    );

    if (!participant) {
      throw new Error('Participant not found in this conversation');
    }

    participant.blacklisted = !participant.blacklisted;

    participant.changed('blacklisted', true);

    await participant.save();

    return chat;
  } catch (err) {
    throw new ServerError('Error updating black list status', err);
  }
};

module.exports.updateFavoriteStatus = async (conversationId, userId) => {
  try {
    const participant = await bd.ConversationParticipants.findOne({
      where: {
        conversation_id: conversationId,
        user_id: userId,
      },
    });

    if (!participant) {
      throw new Error('Participant not found in this conversation');
    }

    participant.favorited = !participant.favorited;
    participant.changed('favorited', true);
    await participant.save();

    return participant;
  } catch (err) {
    throw new ServerError('Error updating favorite status', err);
  }
};

module.exports.getCatalogsByUserId = async userId => {
  const catalogs = await bd.Catalogs.findAll({
    where: { user_id: userId },
    attributes: ['id', 'catalog_name'],
    include: {
      model: bd.Conversations,
      as: 'Conversations',
      attributes: ['id'],
      through: { attributes: [] },
    },
  });

  return catalogs.map(catalog => ({
    _id: catalog.id.toString(),
    catalogName: catalog.catalog_name,
    chats: catalog.Conversations.map(conv => Number(conv.id)),
  }));
};

module.exports.createCatalog = async (
  userId,
  catalogName,
  chatId,
  transaction
) => {
  const catalog = await bd.Catalogs.create(
    { user_id: userId, catalog_name: catalogName },
    { transaction }
  );

  let chats = [];
  if (chatId) {
    const chat = await bd.Conversations.findByPk(chatId);
    if (!chat) throw new Error('Чат не знайдено');

    await bd.CatalogChats.create(
      { catalog_id: catalog.id, conversation_id: chatId },
      { transaction }
    );

    chats.push(chatId);
  }

  return {
    userId: catalog.user_id,
    catalogName: catalog.catalog_name,
    chats,
    _id: catalog.id.toString(),
  };
};

module.exports.updateCatalogName = async (catalogId, userId, catalogName) => {
  const [updatedRows, [updatedCatalog]] = await bd.Catalogs.update(
    { catalog_name: catalogName },
    {
      where: {
        id: catalogId,
        user_id: userId,
      },
      returning: true,
    }
  );

  if (!updatedCatalog) return null;

  const catalogChats = await bd.CatalogChats.findAll({
    where: { catalog_id: updatedCatalog.id },
    attributes: ['conversation_id'],
  });

  const chatIds = catalogChats.map(item => item.conversation_id);

  return {
    _id: updatedCatalog.id.toString(),
    userId: updatedCatalog.user_id,
    catalogName: updatedCatalog.catalog_name,
    chats: chatIds,
  };
};

module.exports.addChatToCatalog = async (catalogId, userId, chatId) => {
  const catalog = await bd.Catalogs.findOne({
    where: { id: catalogId, user_id: userId },
  });

  if (!catalog) return null;

  await bd.CatalogChats.findOrCreate({
    where: { catalog_id: catalogId, conversation_id: chatId },
  });

  const updatedCatalog = await bd.Catalogs.findOne({
    where: { id: catalogId },
    attributes: ['id', 'user_id', 'catalog_name'],
    include: [
      {
        model: bd.Conversations,
        as: 'Conversations',
        attributes: ['id'],
        through: { attributes: [] },
      },
    ],
  });

  return {
    _id: updatedCatalog.id,
    userId: updatedCatalog.user_id,
    catalogName: updatedCatalog.catalog_name,
    chats: updatedCatalog.Conversations.map(conv => conv.id),
  };
};

module.exports.removeChatFromCatalog = async (catalogId, chatId, userId) => {
  const catalog = await bd.Catalogs.findOne({
    where: {
      id: catalogId,
      user_id: userId,
    },
  });

  if (!catalog) return null;

  await bd.CatalogChats.destroy({
    where: {
      catalog_id: catalogId,
      conversation_id: chatId,
    },
  });

  const updatedCatalog = await bd.Catalogs.findOne({
    where: {
      id: catalogId,
      user_id: userId,
    },
    attributes: ['id', 'catalog_name', 'user_id'],
    include: {
      model: bd.Conversations,
      as: 'Conversations',
      attributes: ['id'],
      through: { attributes: [] },
    },
  });

  return {
    _id: updatedCatalog.id.toString(),
    userId: updatedCatalog.user_id,
    catalogName: updatedCatalog.catalog_name,
    chats: updatedCatalog.Conversations.map(c => Number(c.id)),
  };
};

module.exports.deleteCatalog = async (catalogId, userId) => {
  const deleted = await bd.Catalogs.destroy({
    where: { id: catalogId, user_id: userId },
  });
  return deleted;
};
